# Foundry FX — AI Sales Message

## What it does

Standalone FastAPI service and static Trade Builder demo for creating grounded, editable FX sales messages. The AI uses deal facts, product termsheet grounding, client profile context, and advisor-configured writing preferences. No email is sent by the demo.

## Data model

- `SalesMessageRequest`: product and product family, deal terms, termsheet outline/benefits/risks, advisor note, client profile, AI setup preferences, and subject/alternative toggles.
- `SalesMessageResponse`: generated message, optional subject and alternative message, model, and UTC generation timestamp.
- Browser-local `clientProfile` and `aiPreferences` objects persist setup choices in localStorage.

## Key flows

1. Configure product family and deal inputs.
2. Complete the client profile and optionally edit AI setup guidance.
3. Open the embedded AI Sales Message dialogue, write a note, and draft a message.
4. Switch between a dynamically rendered Full Termsheet and Deal Highlights preview; both reflect the current product and deal terms.
5. Review the generated message in Review & Send, edit it freely, and use the demo send action.

## Auth and roles

No user login or roles in the demo. The optional `AI_API_TOKEN` bearer gate remains supported by the backend.

## Integrations

The existing OpenAI integration remains unchanged as the only provider. No new third-party integrations were added. Email sending and dictation are DEMO or browser capability dependent.