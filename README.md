# Foundry FX — Context-Aware Trade Builder

Makes the Trade Builder's **Review & Send** workflow polish a short advisor note
into a ready-to-send client message, using one focused OpenAI call grounded in
the deal, selected product family, client profile, and advisor's AI setup — no
invented facts or external feeds.

This is a **new standalone repo**: the AI backend service plus a self-contained
demo of the modal so the feature is testable end to end without touching the
live builder.

```
backend/            Python FastAPI service (the "LLM API" component)
  app/
    main.py         POST /v1/ai/sales-message
    ai.py           prompt construction + OpenAI call
    schemas.py      request/response contracts (Pydantic)
    config.py       env config (.env)
  tests/            pytest — contract, grounding, auth gate
demo/               static preview of the Review & Send "AI Sales Message" box
  index.html        modal reproduction
  app.js            note → draft → replace-with-history, mic dictation
  data/product-schemas.sample.js   benefits[]/risks[] for a representative set
```

## Run it

```bash
cd backend
python -m venv .venv && .venv/Scripts/activate      # Windows
pip install -r requirements.txt
```

```bash
copy ..\..\.env.example ..\..\.env                  # or copy .env.example → .env
# open .env and set your OPENAI_API_KEY=
```

Start the service (serves the demo at `/` and the API at `/v1/ai/sales-message`):

```bash
uvicorn app.main:app --reload --port 8000
```

Open http://localhost:8000 — pick a product family and structure, complete the
client profile, type (or dictate) the note, and **Draft with AI**. The polished
message lands in the editable Intro message box; every draft stays in the strip
above it (replace-with-history). The **Send Email** button is **MOCKED** and does
not email anything.

## What the AI gets

One call per draft. `deal_terms` is a plain label→value map, not a fixed set of
keys — each of the 71 products has its own real key-term fields (from that
product's `scheduleColumns`, e.g. FEC has Expiry/Protection/FEC Rate while a
Swap has Swap Spot/Maturity/Spot Rate/Swap Rate), rendered dynamically in the
demo's "Deal context" panel and sent through as-is:

```jsonc
{
  "product": "FEC",
  "deal_terms": {             // pair/direction/notional + that product's own fields
    "Pair": "AUDCNH",
    "Direction": "Buy CNH",
    "Notional": "CNH 1,000,000",
    "Expiry": "2026-12-09",
    "Protection": "1,000,000",
    "FEC Rate": "0.6545"
  },
  "product_outline": ["…"],   // termsheet.outline, background only
  "product_benefits": ["…"],  // termsheet.benefits, verbatim from product-schemas.js
  "product_risks": ["…"],     // termsheet.risks
  "advisor_note": "…",
  "client_name": "…",
  "client_company": "…",
  "suggest_subject": false,   // toggle: ask for a structured {message, subject}
  "show_alternative": false   // toggle: ask for a second draft, same facts, different angle
}
```

`product_outline`/`product_benefits`/`product_risks` may still contain the
source data's `{PAIR}`/`{BASE}`/`{QUOTE}`/`{NOTIONAL}` placeholders — the demo
substitutes them client-side from the pair/notional currency on screen
(`substPlaceholders()` in `app.js`, mirroring the builder's
`termsheetCopyForProduct()`) before sending, exactly as the real Trade Builder
does.

The system prompt is strict about the Feature 2 boundary: the model may only
reword the material it is given — exact figures are to be reproduced
unchanged, no market commentary, no invented rationale, and it is explicitly
told never to mention margin, desk revenue, commission or any other internal
pricing component even if one appears in the input.

**Open item — "Show alternative":** the spec flagged this as undefined. This
build's interpretation is a toggle that asks the same single call for a second
draft using identical facts but a different tone/angle (structured JSON output
alongside the primary message, not a second LLM call). The UI marks it
explicitly as an interpretation to confirm with Hannah before treating it as
final.

## Tests

```bash
cd backend && .venv/Scripts/activate
pytest
```

## Wiring into the real Trade Builder (integration follow-up, not in this repo)

1. **Where the box goes:** `builder/index.html` → the `#emailModal` (Review
   & send, `F:\Foundry\foundryfx\builder\index.html`). Add the note textarea,
   mic button and "Draft with AI" button; the polished message fills the
   existing `#emailIntro` textarea. Regenerate the golden DOM snapshots in
   `builder/tools/golden/dom/` when the modal changes.
2. **Where the call runs:** the demo calls the FastAPI service directly. In the
   builder, the same `buildPayload` + draft logic rides on the advisor's
   authenticated session. Recommended: add the OpenAI call to the Rust API
   (`api/crates`) so the key stays server-side and the builder calls
   `POST /v1/ai/sales-message` on `SYFX_API_BASE`; alternatively run this
   FastAPI service behind your own auth and call it cross-origin.
3. **Show alternative:** deferred per plan — each history entry is a natural
   place to hang `{ alternatives[] }` later.

## Deployment notes

- **Render:** this repo includes a `render.yaml` Blueprint. In the Render
  dashboard: **New +** → **Blueprint** → pick this GitHub repo → Render reads
  `render.yaml` and creates the web service (`pip install -r requirements.txt`,
  `uvicorn app.main:app --host 0.0.0.0 --port $PORT`, root dir `backend`).
  You'll be prompted to fill in the two secret env vars it leaves blank
  (`OPENAI_API_KEY` required, `AI_API_TOKEN` optional) — everything else
  deploys automatically on every push to `master`.
- **Render/Cloud Run** both work; the two required env vars are
  `OPENAI_API_KEY` and `AI_MODEL` (default `gpt-4o-mini`, override per quality
  or budget). `AI_TEMPERATURE` defaults to `0.6`.
- `AI_API_TOKEN`: the API key(s). When set, every request must carry
  `Authorization: Bearer <key>` or `X-API-Key: <key>` (401 otherwise); several
  keys can be comma-separated. Empty = open. See [API.md](API.md) for the
  integration guide.
- The built-in web page never needs the key: it drafts through
  `/v1/ui/sales-message`, which only accepts same-origin browser requests and is
  rate-limited (`UI_RATE_LIMIT` per visitor, default 30, and
  `UI_RATE_LIMIT_GLOBAL`, default 300, per `UI_RATE_WINDOW_SECONDS`, default
  600). Set `UI_ENABLED=false` to turn the page's endpoint off.
- Optional `CORS_ORIGINS`: comma-separated origins allowed to call the API from
  a browser on another domain.
- In production put the service behind TLS and your own auth; do not disable
  the token.
- The demo is served from the same origin as the API here, so no CORS is
  needed for this repo. For a cross-origin integration, set your own CORS
  allowlist (FastAPI middleware).