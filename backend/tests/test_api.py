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
    yield


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