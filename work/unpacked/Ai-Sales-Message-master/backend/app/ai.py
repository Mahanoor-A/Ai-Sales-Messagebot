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
    lines += [f"- {key}: {value}" for key, value in req.deal_terms.items() if value]

    if req.product_outline:
        lines.append("\nPRODUCT OVERVIEW (background only, from the desk's termsheet):")
        lines += [f"- {o}" for o in req.product_outline]

    lines.append("\nPRODUCT BENEFITS (as provided by the desk):")
    lines += [f"- {b}" for b in req.product_benefits] or ["- none"]

    lines.append("\nPRODUCT RISKS (as provided by the desk):")
    lines += [f"- {r}" for r in req.product_risks] or ["- none"]

    if req.client_name or req.client_company:
        lines.append("\nCLIENT:")
        if req.client_name:
            lines.append(f"- contact name: {req.client_name}")
        if req.client_company:
            lines.append(f"- company: {req.client_company}")

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
