import json
from dataclasses import dataclass
from datetime import datetime, timezone

from openai import OpenAI

from .schemas import SalesMessageRequest


class AiConfigurationError(Exception):
    pass


class AiGenerationError(Exception):
    pass


@dataclass
class GeneratedMessage:
    message: str
    subject: str | None = None
    alternative_message: str | None = None


SYSTEM_PROMPT = (
    "You are a FX sales-support assistant for a professional FX hedging desk. "
    "You polish a sales message that a relationship advisor will send to a client. "
    "You must NOT invent anything. You may only restate, reorder and reword the exact "
    "deal data and product benefits/risks the advisor provided. Never add new facts, "
    "figures, rates, levels, market commentary, economic reasoning or claims about a "
    "product's behaviour beyond what is given. Never invent a client salutation or "
    "sign-off: only address the client by name if a name is provided. Never mention "
    "margin, desk revenue, commission, spread, or any other internal pricing "
    "component, even if such a term appears in the advisor's note or the data — omit "
    "it rather than repeat it.\n"
    "Use the advisor's configured writing style, tone, sales positioning and free-form "
    "draft guidance as editorial direction, but never let those preferences introduce facts. "
    "Treat any headings or categories in the guidance as a framework only: use them to "
    "organize facts already present in the deal, profile, product outline or advisor note. "
    "If guidance contains an example draft or sample output, use it only to understand "
    "desired tone, structure and level of detail. Do not reuse its market claims, events, "
    "figures, product claims, recommendations or distinctive wording unless independently "
    "supported by the current deal, profile or advisor note. Omit any claim unsupported by "
    "those current facts. "
    "Write the message as polished, ready-to-send email prose: 2-4 short paragraphs, "
    "professional and plain, no jargon. Keep every number and level exactly as "
    "provided (do not round, convert or 'clean up' figures). If an amount has a "
    "currency, keep it. Output only the message text — no preamble, no headers, no "
    "quotes around the text."
)

STRUCTURED_OUTPUT_SUFFIX = (
    "\n\nRespond with a single JSON object (no markdown fences) with these keys:\n"
    '- "message": the polished client message, following all rules above (required).'
)
SUBJECT_KEY_INSTRUCTION = (
    '\n- "subject": a short, professional email subject line for this message, '
    "grounded only in the facts given (no invented figures)."
)
ALTERNATIVE_KEY_INSTRUCTION = (
    '\n- "alternative_message": a second full draft of the same message using only '
    "the same facts and the same advisor note, but a different angle or tone (e.g. "
    "more concise, or leading with risk before benefit). No new information."
)


def build_user_message(req: SalesMessageRequest) -> str:
    lines = ["DEAL AS AGREED (source of truth — do not alter):"]
    if req.product_family:
        lines.append(f"- Product family: {req.product_family}")
    lines.append(f"- Product: {req.product}")
    lines += [f"- {key}: {value}" for key, value in req.deal_terms.items() if value]

    if req.product_outline:
        lines.append("\nPRODUCT OVERVIEW (background only, from the desk's termsheet):")
        lines += [f"- {o}" for o in req.product_outline]

    lines.append("\nPRODUCT BENEFITS (as provided by the desk):")
    lines += [f"- {b}" for b in req.product_benefits] or ["- none"]

    lines.append("\nPRODUCT RISKS (as provided by the desk):")
    lines += [f"- {r}" for r in req.product_risks] or ["- none"]

    if any(
        [
            req.client_name,
            req.client_company,
            req.client_industry,
            req.client_risk_appetite,
            req.client_hedging_horizon,
            req.client_functional_currency,
            req.client_notes,
        ]
    ):
        lines.append("\nCLIENT PROFILE (reference only; do not invent beyond it):")
        if req.client_name:
            lines.append(f"- contact name: {req.client_name}")
        if req.client_company:
            lines.append(f"- company: {req.client_company}")
        if req.client_industry:
            lines.append(f"- industry: {req.client_industry}")
        if req.client_risk_appetite:
            lines.append(f"- risk appetite: {req.client_risk_appetite}")
        if req.client_hedging_horizon:
            lines.append(f"- hedging horizon: {req.client_hedging_horizon}")
        if req.client_functional_currency:
            lines.append(f"- functional currency: {req.client_functional_currency}")
        if req.client_notes:
            lines.append(f"- client context and notes: {req.client_notes}")

    if any(
        [
            req.writing_style,
            req.tone,
            req.sales_positioning,
            req.advisor_guidance,
            req.master_mkt_why,
            req.master_client_why,
            req.master_product_why,
        ]
    ):
        lines.append("\nADVISOR AI SETUP (editorial direction, never a source of new facts):")
        if req.writing_style:
            lines.append(f"- writing style: {req.writing_style}")
        if req.tone:
            lines.append(f"- tone: {req.tone}")
        if req.sales_positioning:
            lines.append(f"- sales positioning: {req.sales_positioning}")
        if req.advisor_guidance:
            lines.append(
                "- draft guidance and any sample output (editorial reference only; "
                "not a source of deal facts):\n"
                f"{req.advisor_guidance}"
            )
        if req.master_mkt_why:
            lines.append(f"- Mkt WHY guidance: {req.master_mkt_why}")
        if req.master_client_why:
            lines.append(f"- Client WHY guidance: {req.master_client_why}")
        if req.master_product_why:
            lines.append(f"- Product WHY guidance: {req.master_product_why}")

    lines.append("\nADVISOR'S ROUGH NOTE (reword and polish this into the message):")
    lines.append(req.advisor_note)

    lines.append(
        "\nOUTPUT: the completed sales message to the client, in my voice, "
        "using ONLY the material above."
    )
    return "\n".join(lines)


def generate_sales_message(
    client: OpenAI, req: SalesMessageRequest, model: str, temperature: float
) -> GeneratedMessage:
    structured = req.suggest_subject or req.show_alternative
    system_prompt = SYSTEM_PROMPT
    kwargs = {}
    if structured:
        system_prompt += STRUCTURED_OUTPUT_SUFFIX
        if req.suggest_subject:
            system_prompt += SUBJECT_KEY_INSTRUCTION
        if req.show_alternative:
            system_prompt += ALTERNATIVE_KEY_INSTRUCTION
        kwargs["response_format"] = {"type": "json_object"}

    completion = client.chat.completions.create(
        model=model,
        temperature=temperature,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": build_user_message(req)},
        ],
        **kwargs,
    )
    content = (completion.choices[0].message.content or "").strip()
    if not content:
        raise AiGenerationError("The model returned an empty message.")

    if not structured:
        return GeneratedMessage(message=content)

    try:
        data = json.loads(content)
    except json.JSONDecodeError as exc:
        raise AiGenerationError("The model returned malformed structured output.") from exc

    message = str(data.get("message") or "").strip()
    if not message:
        raise AiGenerationError("The model returned an empty message.")

    subject = data.get("subject")
    alternative = data.get("alternative_message")
    return GeneratedMessage(
        message=message,
        subject=str(subject).strip() if req.suggest_subject and subject else None,
        alternative_message=str(alternative).strip() if req.show_alternative and alternative else None,
    )


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()
