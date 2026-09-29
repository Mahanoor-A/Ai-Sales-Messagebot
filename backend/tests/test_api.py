import pytest
from fastapi.testclient import TestClient

from app import ai
from app.main import app
from app.schemas import SalesMessageRequest

client = TestClient(app)


@pytest.fixture(autouse=True)
def fake_key_available(monkeypatch):
    """Endpoints in this suite assume the OpenAI key is configured unless a
    test explicitly clears it. Dependency resolution runs before body
    validation, so a missing key (503) would otherwise mask schema 422s."""
    from app import config

    monkeypatch.setattr(config.settings, "openai_api_key", "test-key")
    monkeypatch.setattr(config.settings, "api_token", "")
    monkeypatch.setattr(config.settings, "ai_enabled", True)
    monkeypatch.setattr(config.settings, "ai_org_allowlist", "")
    monkeypatch.setattr(config.settings, "ai_org_blocklist", "")
    monkeypatch.setattr(config.settings, "ai_allowed_roles", "")
    yield


def test_ai_feature_can_be_disabled_globally(monkeypatch):
    from app import config

    monkeypatch.setattr(config.settings, "ai_enabled", False)
    resp = client.post(
        "/v1/ai/sales-message",
        json={"product": "FEC", "advisor_note": "Need a hedge."},
    )
    assert resp.status_code == 403
    assert "disabled" in resp.json()["detail"].lower()


def test_ai_feature_respects_org_allowlist(monkeypatch):
    from app import config

    monkeypatch.setattr(config.settings, "ai_org_allowlist", "org-123")
    resp = client.post(
        "/v1/ai/sales-message",
        json={"product": "FEC", "advisor_note": "Need a hedge."},
        headers={"X-Org-Id": "org-999"},
    )
    assert resp.status_code == 403
    assert "not allowed" in resp.json()["detail"].lower()


# ---------------------------------------------------------------------- #
# Prompt construction                                                    #
# ---------------------------------------------------------------------- #
def test_builder_message_carries_every_deal_fact_and_grounding():
    req = SalesMessageRequest(
        product="Knock Out Conv. (LEV)",
        deal_terms={
            "Pair": "AUDUSD",
            "Direction": "Buy USD",
            "Notional": "USD 1,000,000",
            "Strike rate": "0.6400",
            "Knock-out barrier": "0.6500",
            "Tenor / expiry": "12 months",
            "Rate amount": "0.6555",
        },
        product_benefits=["Zero premium cost", "Improved rate vs a plain forward"],
        product_risks=["Knock-out activation ends the contract"],
        client_name="Ada Novik",
        client_company="Novik Trading",
        advisor_note="they want to lock in above this level and downside is protected",
    )
    msg = ai.build_user_message(req)

    for expected in [
        "Pair: AUDUSD",
        "Direction: Buy USD",
        "Notional: USD 1,000,000",
        "Strike rate: 0.6400",
        "Knock-out barrier: 0.6500",
        "Tenor / expiry: 12 months",
        "Rate amount: 0.6555",
        "Zero premium cost",
        "Knock-out activation ends the contract",
        "Ada Novik",
        "Novik Trading",
        "ADVISOR'S ROUGH NOTE",
    ]:
        assert expected in msg, f"missing {expected!r}"

    assert "DO NOT alter" in msg or "source of truth" in msg


def test_empty_benefits_are_rendered_as_none():
    req = SalesMessageRequest(
        product="FEC",
        advisor_note="client needs a plain hedge",
    )
    msg = ai.build_user_message(req)
    assert "PRODUCT BENEFITS" in msg
    assert "- none" in msg


def test_deal_terms_render_generic_labels_in_order():
    req = SalesMessageRequest(
        product="Ratio",
        deal_terms={"Pair": "AUDEUR", "Enhanced Rate": "0.68", "Leverage": "EUR 2,000,000"},
        advisor_note="lock in the enhanced rate",
    )
    msg = ai.build_user_message(req)
    assert "- Pair: AUDEUR" in msg
    assert "- Enhanced Rate: 0.68" in msg
    assert "- Leverage: EUR 2,000,000" in msg


def test_product_outline_is_included_as_background():
    req = SalesMessageRequest(
        product="FEC",
        product_outline=["A Forward Exchange Contract (FEC) is a binding agreement..."],
        advisor_note="client wants to lock in the rate",
    )
    msg = ai.build_user_message(req)
    assert "PRODUCT OVERVIEW" in msg
    assert "binding agreement" in msg


def test_builder_message_carries_client_profile_and_ai_setup():
    req = SalesMessageRequest(
        product="FEC",
        product_family="Linear / Vanilla",
        advisor_note="Focus on budget certainty.",
        client_industry="Import & distribution",
        client_risk_appetite="Balanced",
        client_hedging_horizon="3–12 months",
        client_functional_currency="AUD",
        client_notes="Needs USD 3m per month.",
        writing_style="Relationship-first",
        tone="Warm",
        sales_positioning="Lead with the client's practical outcome.",
        master_mkt_why="Use only supplied market rationale.",
        master_client_why="Connect the stated objective to the structure.",
        master_product_why="Explain benefits and risks plainly.",
    )
    msg = ai.build_user_message(req)

    for expected in [
        "Product family: Linear / Vanilla",
        "industry: Import & distribution",
        "risk appetite: Balanced",
        "hedging horizon: 3–12 months",
        "functional currency: AUD",
        "Needs USD 3m per month.",
        "writing style: Relationship-first",
        "tone: Warm",
        "Mkt WHY guidance",
        "Client WHY guidance",
        "Product WHY guidance",
    ]:
        assert expected in msg


def test_builder_message_includes_free_form_advisor_guidance():
    req = SalesMessageRequest(
        product="FEC",
        advisor_note="Focus on budget certainty.",
        advisor_guidance=(
            "Market: Use only the supplied rationale.\n\n"
            "Client: Explain relevance to their stated objective.\n\n"
            "Keep the product trade-offs clear."
        ),
    )
    msg = ai.build_user_message(req)

    assert "draft guidance and any sample output" in msg
    assert "Market: Use only the supplied rationale." in msg
    assert "Client: Explain relevance to their stated objective." in msg
    assert "Keep the product trade-offs clear." in msg


def test_system_prompt_treats_sample_guidance_as_style_only():
    prompt = ai.SYSTEM_PROMPT.lower()
    assert "sample output" in prompt
    assert "do not reuse its market claims" in prompt
    assert "unless independently supported" in prompt


# ---------------------------------------------------------------------- #
# Structured output: subject line + alternative version toggles          #
# ---------------------------------------------------------------------- #
class _FakeMessage:
    def __init__(self, content):
        self.content = content


class _FakeChoice:
    def __init__(self, content):
        self.message = _FakeMessage(content)


class _FakeCompletion:
    def __init__(self, content):
        self.choices = [_FakeChoice(content)]


class _FakeCompletions:
    def __init__(self, content, capture):
        self._content = content
        self._capture = capture

    def create(self, **kwargs):
        self._capture.update(kwargs)
        return _FakeCompletion(self._content)


class _FakeChat:
    def __init__(self, content, capture):
        self.completions = _FakeCompletions(content, capture)


class _FakeClient:
    def __init__(self, content, capture):
        self.chat = _FakeChat(content, capture)


def test_plain_generation_skips_json_mode():
    capture = {}
    fake_client = _FakeClient("Here is your polished message.", capture)
    req = SalesMessageRequest(product="FEC", advisor_note="lock it in")

    result = ai.generate_sales_message(fake_client, req, model="gpt-4o-mini", temperature=0.6)

    assert result.message == "Here is your polished message."
    assert result.subject is None
    assert result.alternative_message is None
    assert "response_format" not in capture


def test_structured_generation_parses_subject_and_alternative():
    import json

    capture = {}
    content = json.dumps({
        "message": "Primary draft.",
        "subject": "Your AUD/CNH hedge",
        "alternative_message": "Alternative draft, same facts.",
    })
    fake_client = _FakeClient(content, capture)
    req = SalesMessageRequest(
        product="FEC",
        advisor_note="lock it in",
        suggest_subject=True,
        show_alternative=True,
    )

    result = ai.generate_sales_message(fake_client, req, model="gpt-4o-mini", temperature=0.6)

    assert result.message == "Primary draft."
    assert result.subject == "Your AUD/CNH hedge"
    assert result.alternative_message == "Alternative draft, same facts."
    assert capture.get("response_format") == {"type": "json_object"}


def test_structured_generation_requesting_only_subject_omits_alternative():
    import json

    capture = {}
    content = json.dumps({
        "message": "Primary draft.",
        "subject": "Your hedge",
        "alternative_message": "Should be dropped since not requested.",
    })
    fake_client = _FakeClient(content, capture)
    req = SalesMessageRequest(product="FEC", advisor_note="lock it in", suggest_subject=True)

    result = ai.generate_sales_message(fake_client, req, model="gpt-4o-mini", temperature=0.6)

    assert result.subject == "Your hedge"
    assert result.alternative_message is None


def test_malformed_structured_output_raises():
    capture = {}
    fake_client = _FakeClient("not json", capture)
    req = SalesMessageRequest(product="FEC", advisor_note="lock it in", suggest_subject=True)

    with pytest.raises(ai.AiGenerationError):
        ai.generate_sales_message(fake_client, req, model="gpt-4o-mini", temperature=0.6)


def test_system_prompt_forbids_margin_and_commission_mentions():
    assert "margin" in ai.SYSTEM_PROMPT.lower()
    assert "commission" in ai.SYSTEM_PROMPT.lower()


# ---------------------------------------------------------------------- #
# Request contract                                                       #
# ---------------------------------------------------------------------- #
def test_missing_advisor_note_is_rejected():
    r = client.post("/v1/ai/sales-message", json={"product": "TARF"})
    assert r.status_code == 422


@pytest.mark.parametrize("field", ["product_benefits", "product_risks"])
def test_benefits_and_risks_must_be_strings(field):
    payload = {
        "product": "TARF",
        "advisor_note": "lock in a better average rate",
        field: ["ok", 123],
    }
    r = client.post("/v1/ai/sales-message", json=payload)
    assert r.status_code == 422


def test_unknown_terms_are_ignored_not_rejected(monkeypatch):
    monkeypatch.setattr(
        "app.ai.generate_sales_message",
        lambda client, req, model, temperature: ai.GeneratedMessage(message="Polished message."),
    )
    payload = {
        "product": "TARF",
        "advisor_note": "lock in",
        "deal_terms": {"spurious": "x", "pair": "AUDUSD"},
    }
    r = client.post("/v1/ai/sales-message", json=payload)
    assert r.status_code == 200
    assert r.json()["message"] == "Polished message."


# ---------------------------------------------------------------------- #
# Key gate                                                               #
# ---------------------------------------------------------------------- #
def test_missing_key_returns_503_without_calling_provider(monkeypatch):
    from app import config

    monkeypatch.setattr(config.settings, "openai_api_key", "")

    def boom(*_a, **_k):
        raise AssertionError("generate_sales_message must not run without a key")

    monkeypatch.setattr("app.ai.generate_sales_message", boom)
    r = client.post("/v1/ai/sales-message", json={"product": "TARF", "advisor_note": "go"})
    assert r.status_code == 503


# ---------------------------------------------------------------------- #
# Optional bearer-token gate                                             #
# ---------------------------------------------------------------------- #
def test_endpoint_gate_requires_bearer_token_when_configured(monkeypatch):
    from app import config

    monkeypatch.setattr(config.settings, "api_token", "sekrit")
    r = client.post("/v1/ai/sales-message", json={"product": "TARF", "advisor_note": "x"})
    assert r.status_code == 401


def test_endpoint_gate_rejects_wrong_token(monkeypatch):
    from app import config

    monkeypatch.setattr(config.settings, "api_token", "sekrit")
    r = client.post(
        "/v1/ai/sales-message",
        json={"product": "TARF", "advisor_note": "x"},
        headers={"authorization": "Bearer wrong"},
    )
    assert r.status_code == 401


def test_endpoint_gate_accepts_valid_token(monkeypatch):
    from app import config

    monkeypatch.setattr(config.settings, "api_token", "sekrit")
    monkeypatch.setattr(
        "app.ai.generate_sales_message",
        lambda client, req, model, temperature: ai.GeneratedMessage(message="Polished message."),
    )
    r = client.post(
        "/v1/ai/sales-message",
        json={"product": "TARF", "advisor_note": "client wants a hedge"},
        headers={"authorization": "Bearer sekrit"},
    )
    assert r.status_code == 200
    body = r.json()
    assert body["message"] == "Polished message."
    assert body["model"]
    assert body["generated_at"]


def test_endpoint_returns_draft_without_auth_when_token_unset(monkeypatch):
    from app import config

    monkeypatch.setattr(config.settings, "api_token", "")
    monkeypatch.setattr(
        "app.ai.generate_sales_message",
        lambda client, req, model, temperature: ai.GeneratedMessage(message="Polished message."),
    )
    r = client.post(
        "/v1/ai/sales-message",
        json={"product": "Knock In", "advisor_note": "downside protection, upside participation"},
    )
    assert r.status_code == 200
    assert r.json()["message"] == "Polished message."


def test_endpoint_returns_draft_that_was_grounded(monkeypatch):
    from app import config

    captured = {}

    def fake(client, req, model, temperature):
        captured["req"] = req
        captured["model"] = model
        return ai.GeneratedMessage(message="Polished message.")

    monkeypatch.setattr("app.ai.generate_sales_message", fake)
    monkeypatch.setattr(config.settings, "model", "gpt-5-mini")
    payload = {
        "product": "Participating Knock In",
        "deal_terms": {"pair": "EURUSD", "notional": "EUR 1,500,000"},
        "product_benefits": ["participate if the KI has not been hit"],
        "product_risks": ["protection worse than a plain FEC"],
        "advisor_note": "they moved the hedge from a plain forward",
    }
    r = client.post("/v1/ai/sales-message", json=payload)
    assert r.status_code == 200
    assert captured["model"] == "gpt-5-mini"
    assert captured["req"].product == "Participating Knock In"
    assert captured["req"].deal_terms["pair"] == "EURUSD"
    assert captured["req"].product_benefits == ["participate if the KI has not been hit"]
    assert r.json()["model"] == "gpt-5-mini"

def _stub_generation(monkeypatch):
    monkeypatch.setattr(
        "app.ai.generate_sales_message",
        lambda client, req, model, temperature: ai.GeneratedMessage(message="Polished message."),
    )


def test_endpoint_gate_accepts_x_api_key_header(monkeypatch):
    from app import config

    monkeypatch.setattr(config.settings, "api_token", "sekrit")
    _stub_generation(monkeypatch)
    r = client.post(
        "/v1/ai/sales-message",
        json={"product": "TARF", "advisor_note": "x"},
        headers={"x-api-key": "sekrit"},
    )
    assert r.status_code == 200


def test_endpoint_gate_accepts_any_of_several_keys(monkeypatch):
    from app import config

    monkeypatch.setattr(config.settings, "api_token", "old-key, new-key")
    _stub_generation(monkeypatch)
    for key in ("old-key", "new-key"):
        r = client.post(
            "/v1/ai/sales-message",
            json={"product": "TARF", "advisor_note": "x"},
            headers={"authorization": f"Bearer {key}"},
        )
        assert r.status_code == 200
    r = client.post(
        "/v1/ai/sales-message",
        json={"product": "TARF", "advisor_note": "x"},
        headers={"authorization": "Bearer old-key, new-key"},
    )
    assert r.status_code == 401


def test_healthz_reports_whether_auth_is_required(monkeypatch):
    from app import config

    monkeypatch.setattr(config.settings, "api_token", "sekrit")
    assert client.get("/healthz").json()["auth_required"] is True
    monkeypatch.setattr(config.settings, "api_token", "")
    assert client.get("/healthz").json()["auth_required"] is False


def test_cors_origin_list_parses_and_trims():
    from app.config import Settings

    s = Settings(cors_origins=" https://a.example.com/ ,https://b.example.com,, ")
    assert s.cors_origin_list == ["https://a.example.com", "https://b.example.com"]


# ---------------------------------------------------------------------- #
# Built-in page endpoint: keyless, same-origin only, rate-limited        #
# ---------------------------------------------------------------------- #
UI_BODY = {"product": "TARF", "advisor_note": "x"}
SAME_ORIGIN = {"origin": "http://testserver", "host": "testserver"}


@pytest.fixture
def fresh_ui_limits(monkeypatch):
    from app import main

    main._ui_hits.clear()
    main._ui_all.clear()
    yield main
    main._ui_hits.clear()
    main._ui_all.clear()


def test_ui_endpoint_works_without_key_even_when_api_key_is_set(monkeypatch, fresh_ui_limits):
    from app import config

    monkeypatch.setattr(config.settings, "api_token", "sekrit")
    _stub_generation(monkeypatch)
    assert client.post("/v1/ui/sales-message", json=UI_BODY, headers=SAME_ORIGIN).status_code == 200
    assert client.post("/v1/ai/sales-message", json=UI_BODY).status_code == 401


def test_ui_endpoint_accepts_sec_fetch_site_same_origin(monkeypatch, fresh_ui_limits):
    _stub_generation(monkeypatch)
    r = client.post("/v1/ui/sales-message", json=UI_BODY, headers={"sec-fetch-site": "same-origin"})
    assert r.status_code == 200


def test_ui_endpoint_rejects_other_sites_and_non_browser_calls(monkeypatch, fresh_ui_limits):
    _stub_generation(monkeypatch)
    assert client.post("/v1/ui/sales-message", json=UI_BODY).status_code == 403
    r = client.post("/v1/ui/sales-message", json=UI_BODY, headers={"origin": "https://evil.example.com"})
    assert r.status_code == 403


def test_ui_endpoint_rate_limits_per_visitor(monkeypatch, fresh_ui_limits):
    from app import config

    monkeypatch.setattr(config.settings, "ui_rate_limit", 2)
    _stub_generation(monkeypatch)
    codes = [client.post("/v1/ui/sales-message", json=UI_BODY, headers=SAME_ORIGIN).status_code for _ in range(3)]
    assert codes == [200, 200, 429]
    other = {**SAME_ORIGIN, "x-forwarded-for": "203.0.113.9"}
    assert client.post("/v1/ui/sales-message", json=UI_BODY, headers=other).status_code == 200


def test_ui_endpoint_can_be_disabled(monkeypatch, fresh_ui_limits):
    from app import config

    monkeypatch.setattr(config.settings, "ui_enabled", False)
    assert client.post("/v1/ui/sales-message", json=UI_BODY, headers=SAME_ORIGIN).status_code == 404
