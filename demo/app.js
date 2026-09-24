"use strict";

(function () {
  const $ = (id) => document.getElementById(id);
  const STORAGE_KEYS = { profile: "foundryfx.clientProfile", prefs: "foundryfx.aiPreferences" };

  const DEFAULT_PROFILE = {
    clientName: "Ada Novik",
    clientCompany: "Novik Trading",
    clientIndustry: "Import & distribution",
    riskAppetite: "Balanced",
    hedgingHorizon: "3–12 months",
    functionalCurrency: "AUD",
    clientNotes: "Budget rate 0.7200 AUD/USD · needs USD 3m per month · hedges out 12 months.",
  };
  const DEFAULT_PREFS = {
    writingStyle: "Executive",
    tone: "Consultative",
    salesPositioning: "Lead with the client's practical outcome, then make benefits and trade-offs explicit.",
    masterMktWhy: "Use only the market rationale supplied in the advisor note and deal context. Do not add external market commentary.",
    masterClientWhy: "Connect the stated client objective, risk appetite and hedging horizon to the proposed structure without inventing suitability claims.",
    masterProductWhy: "Explain the supplied product benefits and risks plainly. Preserve every rate, amount and condition exactly.",
  };

  function readSaved(key, fallback) {
    try { return { ...fallback, ...(JSON.parse(localStorage.getItem(key) || "{}")) }; }
    catch (_error) { return { ...fallback }; }
  }
  function saveSaved(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (_error) { /* demo still works without storage */ }
  }
  let profile = readSaved(STORAGE_KEYS.profile, DEFAULT_PROFILE);
  let prefs = readSaved(STORAGE_KEYS.prefs, DEFAULT_PREFS);

  class DraftHistory {
    constructor() { this.items = []; this.current = -1; }
    push(text) { this.items.push(text); this.current = this.items.length - 1; }
    get index() { return this.current; }
    get count() { return this.items.length; }
    go(index) { if (index < 0 || index >= this.items.length) return null; this.current = index; return this.items[index]; }
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  function baseCcy(pair) { return String(pair || "").slice(0, 3); }
  function termCcy(pair) { return String(pair || "").slice(3, 6); }
  function substPlaceholders(text, pair, notionalCcy) {
    const base = baseCcy(pair), quote = termCcy(pair), notional = notionalCcy || quote;
    return String(text || "").replace(/\{PAIR\}/g, base && quote ? `${base}/${quote}` : "").replace(/\{BASE\}/g, base).replace(/\{QUOTE\}/g, quote).replace(/\{NOTIONAL\}/g, notional);
  }
  function getSchema(product) { return (window.DEMO_PRODUCT_SCHEMAS && window.DEMO_PRODUCT_SCHEMAS[product]) || null; }
  function familyName(schema) { return schema?.dropdownFamily || schema?.family || "Other structures"; }
  function termsheetCopyForProduct(product, pair, notionalCcy) {
    const t = getSchema(product)?.termsheet || {};
    const subst = (text) => substPlaceholders(text, pair, notionalCcy);
    return { outline: (t.outline || []).map(subst).filter(Boolean), benefits: (t.benefits || []).map(subst).filter(Boolean), risks: (t.risks || []).map(subst).filter(Boolean) };
  }
  function cleanLabel(label) { return String(label || "").replace(/:\s*$/, "").trim(); }
  function dynamicFieldsFor(schema) { return (schema?.fields || []).filter((f) => !(f.key === "notional" && cleanLabel(f.label).toLowerCase() === "notional")).map((f) => ({ ...f, label: cleanLabel(f.label) })); }
  function formatDefault(field, raw) { if (raw === undefined || raw === null || raw === "") return ""; return field.type === "currency" && typeof raw === "number" ? raw.toLocaleString("en-US") : String(raw); }
  function fieldInputType(type) { return type === "date" ? "date" : "text"; }

  const deal = { product: "", productFamily: "", pair: "", direction: "Buy", notional: "", notionalCcy: "", fields: {} };
  const els = {
    product: $("dcProduct"), productMeta: $("dcProductMeta"), pair: $("dcPair"), direction: $("dcDirection"), notional: $("dcNotional"), dynamicFields: $("dcDynamicFields"),
    outlineWrap: $("dcOutlineWrap"), outline: $("dcOutline"), benefits: $("dcBenefits"), risks: $("dcRisks"), tradeString: $("demoTradeString"), emailTo: $("demoEmailTo"),
    note: $("aiNote"), mic: $("micBtn"), draft: $("draftBtn"), draftLabel: $("draftBtnLabel"), status: $("aiStatus"), intro: $("demoIntro"), subject: $("demoSubject"), copyIntro: $("copyIntroBtn"),
    toggleSubject: $("toggleSubject"), toggleAlt: $("toggleAlt"), history: $("aiHistory"), historyChips: $("aiHistoryChips"), historyCount: $("aiHistoryCount"), alt: $("aiAlt"), altText: $("aiAltText"), useAlt: $("useAltBtn"),
    fab: $("aiFab"), popup: $("aiPopup"), popupClose: $("aiPopupClose"), fmtTabFull: $("fmtTabFull"), fmtTabHighlights: $("fmtTabHighlights"), fmtChip: $("demoFmtChip"), fmtPlaceholder: $("demoFmtPlaceholder"),
    guidanceMarketWhy: $("guidanceMarketWhy"), guidanceClientWhy: $("guidanceClientWhy"), guidanceProductWhy: $("guidanceProductWhy"), guidanceFamily: $("guidanceFamily"), guidanceProfile: $("guidanceProfile"),
    activeStyle: $("aiActiveStyle"), activeTone: $("aiActiveTone"), activePositioning: $("aiActivePositioning"), hint: $("aiHint"), profileSaved: $("profileSavedIndicator"),
  };
  const profileEls = { clientName: $("dcClientName"), clientCompany: $("dcClientCompany"), clientIndustry: $("dcClientIndustry"), riskAppetite: $("dcRiskAppetite"), hedgingHorizon: $("dcHedgingHorizon"), functionalCurrency: $("dcFunctionalCurrency"), clientNotes: $("dcClientNotes") };
  const prefEls = { writingStyle: $("prefWritingStyle"), tone: $("prefTone"), salesPositioning: $("prefPositioning"), masterMktWhy: $("prefMktWhy"), masterClientWhy: $("prefClientWhy"), masterProductWhy: $("prefProductWhy") };

  function setStatus(text, kind) { els.status.textContent = text; els.status.className = `ai-status${kind ? ` is-${kind}` : ""}`; }
  function syncProfileInputs() { Object.keys(profileEls).forEach((key) => { if (profileEls[key]) profileEls[key].value = profile[key] || ""; }); }
  function readProfileInputs() { Object.keys(profileEls).forEach((key) => { profile[key] = profileEls[key]?.value.trim() || ""; }); saveSaved(STORAGE_KEYS.profile, profile); renderGuidance(); updateRecipient(); if (els.profileSaved) els.profileSaved.textContent = "Saved locally"; }
  function syncPrefInputs() { Object.keys(prefEls).forEach((key) => { if (prefEls[key]) prefEls[key].value = prefs[key] || ""; }); }
  function readPrefInputs() { Object.keys(prefEls).forEach((key) => { prefs[key] = prefEls[key]?.value.trim() || ""; }); saveSaved(STORAGE_KEYS.prefs, prefs); renderGuidance(); renderPreferenceStrip(); }
  function renderPreferenceStrip() {
    els.activeStyle.textContent = prefs.writingStyle || "Custom style"; els.activeTone.textContent = prefs.tone || "Custom tone";
    els.activePositioning.textContent = prefs.salesPositioning?.split(/[,.]/)[0] || "Client outcome first";
    els.hint.textContent = `${prefs.writingStyle || "Your"} style · ${prefs.tone || "your"} tone. Ground the note in the deal, client profile and product logic — no invented facts.`;
    document.querySelectorAll("[data-style]").forEach((button) => button.classList.toggle("is-active", button.dataset.style === prefs.writingStyle));
  }
  function updateRecipient() { els.emailTo.textContent = [profile.clientCompany, profile.clientName].filter(Boolean).join(" — ") || "Client profile incomplete"; }

  function buildPayload(note) {
    const copy = termsheetCopyForProduct(deal.product, deal.pair, deal.notionalCcy);
    const dealTerms = { Pair: deal.pair, Direction: deal.direction, Notional: deal.notional };
    dynamicFieldsFor(getSchema(deal.product)).forEach((field) => { if (deal.fields[field.key]) dealTerms[field.label] = deal.fields[field.key]; });
    return {
      product: deal.product, product_family: deal.productFamily, deal_terms: dealTerms, product_outline: copy.outline, product_benefits: copy.benefits, product_risks: copy.risks, advisor_note: note,
      client_name: profile.clientName || null, client_company: profile.clientCompany || null, client_industry: profile.clientIndustry || null, client_risk_appetite: profile.riskAppetite || null,
      client_hedging_horizon: profile.hedgingHorizon || null, client_functional_currency: profile.functionalCurrency || null, client_notes: profile.clientNotes || null,
      writing_style: prefs.writingStyle || null, tone: prefs.tone || null, sales_positioning: prefs.salesPositioning || null, master_mkt_why: prefs.masterMktWhy || null, master_client_why: prefs.masterClientWhy || null, master_product_why: prefs.masterProductWhy || null,
      suggest_subject: !!els.toggleSubject.checked, show_alternative: !!els.toggleAlt.checked,
    };
  }
  async function draftNote(note) {
    const response = await fetch("/v1/ai/sales-message", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(buildPayload(note)) });
    if (!response.ok) { let detail = response.statusText; try { const body = await response.json(); detail = typeof body.detail === "string" ? body.detail : Array.isArray(body.detail) ? body.detail.map((d) => d.msg).join("; ") : detail; } catch (_error) {} throw new Error(detail); }
    const data = await response.json(); return { message: String(data.message || "").trim(), subject: data.subject ? String(data.subject).trim() : "", alternative: data.alternative_message ? String(data.alternative_message).trim() : "" };
  }

  function populateProductSelect() {
    const grouped = {};
    Object.entries(window.DEMO_PRODUCT_SCHEMAS || {}).forEach(([name, schema]) => { const family = familyName(schema); (grouped[family] ||= []).push({ name, schema }); });
    els.product.innerHTML = Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([family, products]) => `<optgroup label="${escapeHtml(family)}">${products.sort((a, b) => a.name.localeCompare(b.name)).map(({ name, schema }) => `<option value="${escapeHtml(name)}" data-family="${escapeHtml(family)}">${escapeHtml(name)} · ${escapeHtml(schema.classification || "Structure")}</option>`).join("")}</optgroup>`).join("");
  }
  function renderDynamicFields() {
    const schema = getSchema(deal.product); deal.fields = {};
    els.dynamicFields.innerHTML = dynamicFieldsFor(schema).map((field) => { const value = formatDefault(field, schema?.sampleDefaults?.[field.key]); deal.fields[field.key] = value; const cls = ["currency", "rate", "integer"].includes(field.type) ? " mono-field" : ""; return `<div class="field"><label for="dcf-${escapeHtml(field.key)}">${escapeHtml(field.label)}</label><input id="dcf-${escapeHtml(field.key)}" data-field-key="${escapeHtml(field.key)}" type="${fieldInputType(field.type)}" class="${cls}" value="${escapeHtml(value)}" data-testid="deal-${escapeHtml(field.key)}-input"></div>`; }).join("");
    els.dynamicFields.querySelectorAll("[data-field-key]").forEach((input) => input.addEventListener("input", () => { deal.fields[input.dataset.fieldKey] = input.value.trim(); renderGuidance(); }));
  }
  function syncDealFromInputs() { deal.pair = els.pair.value.trim(); deal.direction = els.direction.value.trim(); deal.notional = els.notional.value.trim(); els.dynamicFields.querySelectorAll("[data-field-key]").forEach((input) => { deal.fields[input.dataset.fieldKey] = input.value.trim(); }); renderGuidance(); updateTradePreview(); }
  function renderGrounding() {
    const copy = termsheetCopyForProduct(deal.product, deal.pair, deal.notionalCcy);
    els.benefits.innerHTML = (copy.benefits.length ? copy.benefits : ["No benefits added to this product's termsheet block."]).map((text) => `<li>${escapeHtml(text)}</li>`).join("");
    els.risks.innerHTML = (copy.risks.length ? copy.risks : ["No risks added to this product's termsheet block."]).map((text) => `<li>${escapeHtml(text)}</li>`).join("");
    els.outlineWrap.hidden = !copy.outline.length; els.outline.textContent = copy.outline.join(" "); renderGuidance(); updateTradePreview();
  }
  function renderGuidance() {
    const schema = getSchema(deal.product); const copy = termsheetCopyForProduct(deal.product, deal.pair, deal.notionalCcy);
    els.guidanceMarketWhy.textContent = prefs.masterMktWhy || "Add the market rationale you want the AI to use in setup.";
    const clientBits = [profile.clientName, profile.clientIndustry, profile.riskAppetite && `${profile.riskAppetite.toLowerCase()} risk appetite`, profile.hedgingHorizon && `${profile.hedgingHorizon.toLowerCase()} horizon`].filter(Boolean);
    els.guidanceClientWhy.textContent = clientBits.length ? `${clientBits.join(" · ")}. ${prefs.masterClientWhy || "Use the profile to keep the message relevant."}` : "Complete the client profile to make this guidance more specific.";
    els.guidanceProductWhy.textContent = copy.benefits[0] || copy.outline[0] || prefs.masterProductWhy || "Choose a product structure to see its grounded rationale.";
    els.guidanceFamily.textContent = deal.productFamily || "Choose a family"; els.guidanceProfile.textContent = profile.clientName && profile.clientCompany ? "Profile ready" : "Profile needs detail";
    if (schema) els.productMeta.textContent = `${schema.classification || "Structure"} · ${deal.productFamily} · ${dynamicFieldsFor(schema).length} key terms`;
  }
  function updateTradePreview() { els.tradeString.textContent = `${deal.pair || "—"} · ${deal.product || "Choose a structure"}`; }
  function onProductChange() {
    const schema = getSchema(els.product.value); deal.product = els.product.value; deal.productFamily = familyName(schema); deal.notionalCcy = schema?.notionalCcy || "";
    els.pair.value = schema?.pair || ""; els.direction.value = deal.direction || "Buy"; const amount = schema?.sampleDefaults?.notional; els.notional.value = amount ? `${deal.notionalCcy || ""} ${Number(amount).toLocaleString("en-US")}`.trim() : (deal.notionalCcy || "");
    renderDynamicFields(); syncDealFromInputs(); renderGrounding();
  }

  const history = new DraftHistory(); let pendingAlternative = "";
  function renderHistory() {
    if (history.count <= 1) { els.history.hidden = true; return; }
    els.history.hidden = false; els.historyChips.innerHTML = history.items.map((_, index) => `<button type="button" class="ai-chip${index === history.index ? " is-current" : ""}" data-i="${index}" data-testid="ai-history-draft-${index + 1}">Draft ${index + 1}</button>`).join(""); els.historyCount.textContent = `${history.index + 1} of ${history.count}`;
    els.historyChips.querySelectorAll("[data-i]").forEach((button) => button.addEventListener("click", () => { const text = history.go(Number(button.dataset.i)); if (text != null) { els.intro.value = text; renderHistory(); setStatus("Restored an earlier draft.", "ok"); } }));
  }
  function openPopup() { els.popup.classList.add("is-open"); els.popup.setAttribute("aria-hidden", "false"); els.fab.classList.add("is-open"); els.fab.setAttribute("aria-expanded", "true"); els.note.focus(); }
  function closePopup() { els.popup.classList.remove("is-open"); els.popup.setAttribute("aria-hidden", "true"); els.fab.classList.remove("is-open"); els.fab.setAttribute("aria-expanded", "false"); }
  function openSetup() { $("setupDrawer").classList.add("is-open"); $("setupDrawer").setAttribute("aria-hidden", "false"); syncPrefInputs(); prefEls.writingStyle.focus(); }
  function closeSetup() { $("setupDrawer").classList.remove("is-open"); $("setupDrawer").setAttribute("aria-hidden", "true"); }
  function setFormat(format) { const full = format === "full"; [els.fmtTabFull, els.fmtTabHighlights].forEach((tab, index) => { const active = index === (full ? 0 : 1); tab.classList.toggle("is-active", active); tab.setAttribute("aria-selected", String(active)); }); els.fmtChip.textContent = full ? "FULL TERMSHEET" : "DEAL HIGHLIGHTS"; els.fmtChip.classList.toggle("is-full", full); els.fmtChip.classList.toggle("is-highlights", !full); els.fmtPlaceholder.textContent = full ? "termsheet / chart preview renders here in the builder" : "key levels & payoff chart only — renders here in the builder"; setStatus(full ? "Full termsheet format selected." : "Deal highlights format selected.", ""); }

  Object.values(profileEls).forEach((input) => input?.addEventListener("input", readProfileInputs));
  [els.pair, els.direction, els.notional].forEach((input) => input?.addEventListener("input", syncDealFromInputs));
  els.product.addEventListener("change", onProductChange); els.fab.addEventListener("click", () => els.popup.classList.contains("is-open") ? closePopup() : openPopup()); els.popupClose.addEventListener("click", closePopup);
  [$("openSetupTop"), $("openSetupGuidance")].forEach((button) => button?.addEventListener("click", openSetup));
  document.addEventListener("click", (event) => {
    if (!event.target.closest?.("#openAiFromGuidance")) return;
    event.preventDefault();
    event.stopPropagation();
    openPopup();
  }, true);
  $("closeSetup").addEventListener("click", closeSetup); $("setupScrim").addEventListener("click", closeSetup);
  $("saveSetup").addEventListener("click", () => { readPrefInputs(); closeSetup(); setStatus("AI setup saved. New drafts will use this direction.", "ok"); });
  $("resetSetup").addEventListener("click", () => { prefs = { ...DEFAULT_PREFS }; syncPrefInputs(); readPrefInputs(); setStatus("AI setup reset to the workspace defaults.", ""); });
  document.querySelectorAll("[data-style]").forEach((button) => button.addEventListener("click", () => { prefs.writingStyle = button.dataset.style; syncPrefInputs(); readPrefInputs(); }));
  els.fmtTabFull.addEventListener("click", () => setFormat("full")); els.fmtTabHighlights.addEventListener("click", () => setFormat("highlights"));
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") { closePopup(); closeSetup(); } });

  els.draft.addEventListener("click", async () => {
    const note = els.note.value.trim(); if (!note) { setStatus("Type or dictate a short note first.", "error"); els.note.focus(); return; }
    syncDealFromInputs(); els.draft.disabled = true; els.draftLabel.textContent = "Drafting…"; setStatus("Grounding the draft in this deal…", ""); els.alt.hidden = true;
    try { const result = await draftNote(note); history.push(result.message); els.intro.value = result.message; renderHistory(); if (result.subject) els.subject.value = result.subject; if (result.alternative) { pendingAlternative = result.alternative; els.altText.textContent = result.alternative; els.alt.hidden = false; } setStatus(`Draft ready (${history.count} kept). Edit freely before sending.`, "ok"); }
    catch (error) { setStatus(`Could not draft: ${error?.message || "unknown error"}`, "error"); }
    finally { els.draft.disabled = false; els.draftLabel.textContent = "Draft with AI"; }
  });
  els.useAlt.addEventListener("click", () => { if (!pendingAlternative) return; history.push(pendingAlternative); els.intro.value = pendingAlternative; renderHistory(); els.alt.hidden = true; setStatus("Switched to the alternative draft.", "ok"); });
  els.copyIntro.addEventListener("click", async () => { if (!els.intro.value.trim()) { setStatus("Nothing to copy yet.", "error"); return; } try { await navigator.clipboard.writeText(els.intro.value); setStatus("Copied to clipboard.", "ok"); } catch (_error) { setStatus("Could not copy — select and copy manually.", "error"); } });
  $("cancelDemo").addEventListener("click", () => setStatus("Demo only — nothing was sent.", "")); $("mockSend").addEventListener("click", () => setStatus(els.intro.value.trim() ? "Demo only — email not really sent. Review is complete and the editable message is ready." : "No intro message yet. Draft one with AI or type it, then Send.", els.intro.value.trim() ? "ok" : "error"));

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition; let recognition = null; let listening = false;
  if (!SpeechRecognition) { els.mic.disabled = true; els.mic.title = "Dictation is not supported in this browser — type the note instead."; } else { recognition = new SpeechRecognition(); recognition.continuous = true; recognition.interimResults = false; recognition.lang = navigator.language || "en-US"; recognition.onresult = (event) => { const parts = []; for (let i = event.resultIndex; i < event.results.length; i += 1) if (event.results[i].isFinal) parts.push(event.results[i][0].transcript); if (parts.length) els.note.value = `${els.note.value ? `${els.note.value.trimEnd()} ` : ""}${parts.join(" ").trim()}`; }; recognition.onend = () => { listening = false; els.mic.classList.remove("is-live"); }; recognition.onerror = (event) => { if (event?.error && !["no-speech", "aborted"].includes(event.error)) setStatus(`Dictation error: ${event.error}`, "error"); listening = false; els.mic.classList.remove("is-live"); }; els.mic.addEventListener("click", () => { if (listening) recognition.stop(); else { try { recognition.start(); } catch (_error) {} listening = true; els.mic.classList.add("is-live"); setStatus("Listening… speak into the microphone.", ""); } }); }

  syncProfileInputs(); syncPrefInputs(); renderPreferenceStrip(); populateProductSelect(); els.product.value = "Knock Out Conv. (LEV)" in (window.DEMO_PRODUCT_SCHEMAS || {}) ? "Knock Out Conv. (LEV)" : els.product.options[0]?.value || ""; onProductChange(); updateRecipient();
})();