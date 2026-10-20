"use strict";

(function () {
  const $ = (id) => document.getElementById(id);
  const KEYS = {
    clients: "foundryfx.clients", activeClient: "foundryfx.activeClient", legacyProfile: "foundryfx.clientProfile",
    prefs: "foundryfx.aiPreferences", shortcuts: "foundryfx.keyPointShortcuts", panel: "foundryfx.aiPanelOpen", ranking: "foundryfx.orgSalesRanking",
  };
  const store = {
    get(key, fallback) { try { const raw = localStorage.getItem(key); return raw == null ? fallback : JSON.parse(raw); } catch (_e) { return fallback; } },
    set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (_e) { /* works without storage */ } },
  };

  const DEFAULT_CLIENTS = [
    { id: "c-novik", clientName: "Ada Novik", clientCompany: "Novik Trading", clientEmail: "ada.novik@example.com", clientIndustry: "Import & distribution", riskAppetite: "Balanced", hedgingHorizon: "3–12 months", functionalCurrency: "AUD", clientNotes: "Budget rate 0.7200 AUD/USD · needs USD 3m per month · hedges out 12 months." },
    { id: "c-harbour", clientName: "Tom Reyes", clientCompany: "Harbour Street Wines", clientEmail: "tom.reyes@example.com", clientIndustry: "Wine export", riskAppetite: "Conservative", hedgingHorizon: "Up to 3 months", functionalCurrency: "NZD", clientNotes: "Receives EUR from European distributors · wants certainty over the next two quarters." },
  ];
  const PREVIOUS_DEFAULT_ADVISOR_GUIDANCE = [
    "Market: Use only the market rationale supplied in the advisor note and deal context. Do not add external market commentary.",
    "Client: Connect the stated client objective, risk appetite and hedging horizon to the proposed structure without inventing suitability claims.",
    "Product: Explain the supplied product benefits and risks plainly. Preserve every rate, amount and condition exactly.",
  ].join("\n\n");
  const SAMPLE_ADVISOR_GUIDANCE = [
      "Use this sample only as a reference for tone, structure and level of detail. Do not reuse its market claims, events, rates, product claims or other facts unless they are independently present in the current deal context or advisor note.",
      "",
      "Example:",
      "Markets are currently reacting to developments in the US-Iran conflict, with bond yields ending higher and the Australian dollar showing slight weakness at 0.7020. As attention shifts to the RBA's decision, a further increase in the cash rate is widely anticipated.",
      "",
      "The Knock Out Conv. (LEV) product offers compelling advantages in this environment:",
      "",
      "- Participate in favourable exchange rate movements while maintaining protection at a known worst-case rate of 0.657.",
      "",
      "- Achieve enhanced exchange rates compared to standard options, aligning with your goal to reduce costs.",
      "",
      "- Maintain flexibility to adapt to market conditions while ensuring your hedging strategy is robust.",
  ].join("\n");
  const DEFAULT_PREFS = {
    writingStyle: "Executive",
    tone: "Consultative",
    salesPositioning: "Lead with the client's practical outcome, then make benefits and trade-offs explicit.",
    advisorGuidance: SAMPLE_ADVISOR_GUIDANCE,
  };
  const DEFAULT_RANKING_INDICATORS = [
    { id: "client-objectives", name: "References client objectives", guidance: "Connect the proposal to goals, priorities, or objectives explicitly present in the client context." },
    { id: "strong-close", name: "Has a strong close", guidance: "End with a clear, appropriate close that invites a decision or response without overstating." },
    { id: "clear-next-steps", name: "Clear next steps", guidance: "State a concrete next action for the advisor or client when supported by context." },
    { id: "client-profile-alignment", name: "Aligns to client profile", guidance: "Tailor the wording to the supplied client profile, risk appetite, horizon, or industry where relevant." },
    { id: "appropriate-urgency", name: "Sense of urgency", guidance: "Give a timely reason to act only when supported by supplied facts; do not create pressure or false urgency." },
    { id: "trade-confirmation-link", name: "Click link to confirm trade", guidance: "Reference a trade confirmation or execution link only when one is actually supplied in the message or deal context." },
    { id: "ongoing-engagement", name: "Ongoing communication / engagement", guidance: "Invite continued discussion, follow-up, or ongoing engagement in a way that fits the relationship." },
    { id: "deal-parameter-alignment", name: "Aligns to priced product parameters", guidance: "Keep product description aligned with the supplied structure, currency pair, rates, levels, and other deal parameters; preserve them exactly." },
  ];

  function loadClients() {
    let list = store.get(KEYS.clients, null);
    if (!Array.isArray(list) || !list.length) {
      list = DEFAULT_CLIENTS.map((c) => ({ ...c }));
      const legacy = store.get(KEYS.legacyProfile, null);
      if (legacy && legacy.clientName) list[0] = { ...list[0], ...legacy, id: list[0].id };
    }
    return list.filter((c) => c && c.id);
  }
  let clients = loadClients();
  let activeClientId = store.get(KEYS.activeClient, clients[0]?.id || "");
  if (!clients.some((c) => c.id === activeClientId)) activeClientId = clients[0]?.id || "";
  const activeClient = () => clients.find((c) => c.id === activeClientId) || {};
  const savedPrefs = store.get(KEYS.prefs, {}) || {};
  const savedRanking = store.get(KEYS.ranking, null);
  let orgRanking = { indicators: Array.isArray(savedRanking?.indicators) && savedRanking.indicators.length ? savedRanking.indicators : DEFAULT_RANKING_INDICATORS.map((item) => ({ ...item })) };
  let prefs = { ...DEFAULT_PREFS, ...savedPrefs };
  if (savedPrefs.advisorGuidance === PREVIOUS_DEFAULT_ADVISOR_GUIDANCE) {
    prefs.advisorGuidance = SAMPLE_ADVISOR_GUIDANCE;
  }
  if (!Object.prototype.hasOwnProperty.call(savedPrefs, "advisorGuidance")) {
    const legacyGuidance = [
      ["Market", savedPrefs.masterMktWhy],
      ["Client", savedPrefs.masterClientWhy],
      ["Product", savedPrefs.masterProductWhy],
    ].filter(([, value]) => typeof value === "string" && value.trim())
      .map(([label, value]) => `${label}: ${value.trim()}`);
    if (legacyGuidance.length) prefs.advisorGuidance = legacyGuidance.join("\n\n");
  }
  delete prefs.masterMktWhy;
  delete prefs.masterClientWhy;
  delete prefs.masterProductWhy;
  let shortcuts = (() => { const list = store.get(KEYS.shortcuts, []); return Array.isArray(list) ? list.filter((s) => s && s.name && s.note) : []; })();

  // ---- helpers ------------------------------------------------------------
  function esc(value) { return String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
  function baseCcy(pair) { return String(pair || "").slice(0, 3); }
  function termCcy(pair) { return String(pair || "").slice(3, 6); }
  function substPlaceholders(text, pair, notionalCcy) {
    const base = baseCcy(pair), quote = termCcy(pair), notional = notionalCcy || quote;
    return String(text || "").replace(/\{PAIR\}/g, base && quote ? `${base}/${quote}` : "").replace(/\{BASE\}/g, base).replace(/\{QUOTE\}/g, quote).replace(/\{NOTIONAL\}/g, notional);
  }
  function getSchema(product) { return (window.DEMO_PRODUCT_SCHEMAS && window.DEMO_PRODUCT_SCHEMAS[product]) || null; }
  function familyName(schema) { return schema?.dropdownFamily || schema?.family || "Other structures"; }
  function termsheetCopy(product, pair, notionalCcy) {
    const t = getSchema(product)?.termsheet || {};
    const subst = (text) => substPlaceholders(text, pair, notionalCcy);
    return { outline: (t.outline || []).map(subst).filter(Boolean), benefits: (t.benefits || []).map(subst).filter(Boolean), risks: (t.risks || []).map(subst).filter(Boolean) };
  }
  function cleanLabel(label) { return String(label || "").replace(/:\s*$/, "").trim(); }
  function dynamicFieldsFor(schema) { return (schema?.fields || []).filter((f) => !(f.key === "notional" && cleanLabel(f.label).toLowerCase() === "notional")).map((f) => ({ ...f, label: cleanLabel(f.label) })); }
  function formatDefault(field, raw) { if (raw === undefined || raw === null || raw === "") return ""; return field.type === "currency" && typeof raw === "number" ? raw.toLocaleString("en-US") : String(raw); }
  function displayPair(pair) { const b = baseCcy(pair), q = termCcy(pair); return b && q ? `${b}/${q}` : pair || ""; }
  function initials(c) { const src = c.clientCompany || c.clientName || "?"; return src.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase(); }
  function wordCount(text) { const t = String(text || "").trim(); return t ? t.split(/\s+/).length : 0; }

  let toastTimer = 0;
  function toast(text, kind) {
    const el = $("toast"); el.textContent = text; el.className = `toast${kind ? ` is-${kind}` : ""}`; el.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(() => { el.hidden = true; }, 3200);
  }

  // ---- deal ---------------------------------------------------------------
  const deal = { product: "", productFamily: "", pair: "", direction: "Buy", notional: "", notionalCcy: "", fields: {} };
  const els = {
    client: $("dealClient"), clientSummary: $("clientSummary"),
    product: $("dcProduct"), productMeta: $("dcProductMeta"), pair: $("dcPair"), direction: $("dcDirection"), notional: $("dcNotional"), dynamicFields: $("dcDynamicFields"),
    outline: $("dcOutline"), benefits: $("dcBenefits"), risks: $("dcRisks"), tradeString: $("tradeString"),
    notes: $("dealNotes"), subject: $("dealSubject"), intro: $("dealIntro"), introCount: $("introCount"), copyIntro: $("copyIntroBtn"),
    panel: $("aiPanel"), panelToggle: $("aiPanelToggle"), panelClose: $("aiPanelClose"), scrim: $("aiScrim"),
    ctxClient: $("ctxClient"), ctxProduct: $("ctxProduct"), ctxStyle: $("ctxStyle"),
    note: $("aiNote"), mic: $("micBtn"), draft: $("draftBtn"), draftLabel: $("draftBtnLabel"), status: $("aiStatus"),
    toggleSubject: $("toggleSubject"), toggleAlt: $("toggleAlt"), history: $("aiHistory"), historyChips: $("aiHistoryChips"), historyCount: $("aiHistoryCount"),
    alt: $("aiAlt"), altText: $("aiAltText"), useAlt: $("useAltBtn"),
    guidanceMarketWhy: $("guidanceMarketWhy"), guidanceClientWhy: $("guidanceClientWhy"), guidanceProductWhy: $("guidanceProductWhy"),
  };
  const prefEls = { writingStyle: $("prefWritingStyle"), tone: $("prefTone"), salesPositioning: $("prefPositioning"), advisorGuidance: $("prefAdvisorGuidance") };
  const rankingUI = { card: $("rankingCard"), title: $("rankingTitle"), score: $("rankingScore"), meter: $("rankingMeter"), marker: $("rankingMarker"), note: $("rankingNote"), indicators: $("rankingIndicators") };
  const introRankingClasses = ["is-ranked", "is-red", "is-amber", "is-green", "is-ranking-stale"];
  function setIntroRanking(band) {
    els.intro.classList.remove(...introRankingClasses);
    if (["red", "amber", "green"].includes(band)) els.intro.classList.add("is-ranked", `is-${band}`);
    else if (band === "stale") els.intro.classList.add("is-ranking-stale");
  }
  let suggestedSubject = "";

  function setStatus(text, kind) { els.status.textContent = text; els.status.className = `ai-status${kind ? ` is-${kind}` : ""}`; }

  function populateProductSelect() {
    const grouped = {};
    Object.entries(window.DEMO_PRODUCT_SCHEMAS || {}).forEach(([name, schema]) => { (grouped[familyName(schema)] ||= []).push({ name, schema }); });
    els.product.innerHTML = Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([family, products]) => `<optgroup label="${esc(family)}">${products.sort((a, b) => a.name.localeCompare(b.name)).map(({ name, schema }) => `<option value="${esc(name)}">${esc(name)} · ${esc(schema.classification || "Structure")}</option>`).join("")}</optgroup>`).join("");
  }
  function renderDynamicFields() {
    const schema = getSchema(deal.product); deal.fields = {};
    const fields = dynamicFieldsFor(schema);
    els.dynamicFields.innerHTML = fields.length ? fields.map((field) => {
      const value = formatDefault(field, schema?.sampleDefaults?.[field.key]); deal.fields[field.key] = value;
      const mono = ["currency", "rate", "integer"].includes(field.type) ? " mono" : "";
      return `<div class="field"><label for="dcf-${esc(field.key)}">${esc(field.label)}</label><input id="dcf-${esc(field.key)}" data-field-key="${esc(field.key)}" type="${field.type === "date" ? "date" : "text"}" class="${mono.trim()}" value="${esc(value)}" autocomplete="off" data-testid="deal-dynamic-${esc(field.key)}-input"></div>`;
    }).join("") : `<p class="empty span-all">This structure has no extra key terms.</p>`;
    els.dynamicFields.querySelectorAll("[data-field-key]").forEach((input) => input.addEventListener("input", () => { deal.fields[input.dataset.fieldKey] = input.value.trim(); refreshDealViews(); }));
  }
  function syncDealFromInputs() {
    deal.pair = els.pair.value.trim(); deal.direction = els.direction.value.trim(); deal.notional = els.notional.value.trim();
    els.dynamicFields.querySelectorAll("[data-field-key]").forEach((input) => { deal.fields[input.dataset.fieldKey] = input.value.trim(); });
    refreshDealViews();
  }
  function renderGrounding() {
    const copy = termsheetCopy(deal.product, deal.pair, deal.notionalCcy);
    const list = (items, empty) => (items.length ? items : [empty]).map((t) => `<li>${esc(t)}</li>`).join("");
    els.benefits.innerHTML = list(copy.benefits, "No benefits listed for this structure.");
    els.risks.innerHTML = list(copy.risks, "No risks listed for this structure.");
    els.outline.hidden = !copy.outline.length; els.outline.textContent = copy.outline.join(" ");
  }
  function refreshDealViews() {
    const schema = getSchema(deal.product);
    if (schema) els.productMeta.textContent = `${deal.productFamily} · ${dynamicFieldsFor(schema).length} key terms`;
    els.tradeString.textContent = [displayPair(deal.pair), deal.product, deal.notional].filter(Boolean).join("  ·  ") || "—";
    renderContext(); renderGuidance();
  }
  function onProductChange() {
    const schema = getSchema(els.product.value); deal.product = els.product.value; deal.productFamily = familyName(schema); deal.notionalCcy = schema?.notionalCcy || "";
    els.pair.value = schema?.pair || ""; els.direction.value = deal.direction || "Buy";
    const amount = schema?.sampleDefaults?.notional; els.notional.value = amount ? `${deal.notionalCcy || ""} ${Number(amount).toLocaleString("en-US")}`.trim() : (deal.notionalCcy || "");
    renderDynamicFields(); syncDealFromInputs(); renderGrounding();
  }

  // ---- clients ------------------------------------------------------------
  function saveClients() { store.set(KEYS.clients, clients); store.set(KEYS.activeClient, activeClientId); }
  function renderClientSelect() {
    els.client.innerHTML = clients.map((c) => `<option value="${esc(c.id)}">${esc(c.clientCompany || c.clientName || "Unnamed client")}${c.clientCompany && c.clientName ? ` — ${esc(c.clientName)}` : ""}</option>`).join("") || `<option value="">No clients yet</option>`;
    els.client.value = activeClientId;
  }
  function renderClientSummary() {
    const c = activeClient();
    if (!c.id) { els.clientSummary.innerHTML = `<div class="client-card-empty">No client selected. <button class="link-btn" type="button" data-open-clients="new">Add a client</button></div>`; return; }
    const tags = [c.riskAppetite && c.riskAppetite !== "Not set" && `${c.riskAppetite} risk`, c.hedgingHorizon && c.hedgingHorizon !== "Not set" && c.hedgingHorizon, c.functionalCurrency, c.clientIndustry].filter(Boolean);
    els.clientSummary.innerHTML = `
      <span class="client-avatar" aria-hidden="true">${esc(initials(c))}</span>
      <div class="client-card-body">
        <div class="client-card-top"><strong>${esc(c.clientCompany || c.clientName)}</strong><button class="link-btn" type="button" data-open-clients="edit" data-testid="client-edit-profile-button"><svg class="icon icon-sm" aria-hidden="true"><use href="#i-edit"/></svg>Edit profile</button></div>
        <span class="client-contact">${esc([c.clientName, c.clientEmail].filter(Boolean).join(" · "))}</span>
        ${tags.length ? `<div class="tag-row">${tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>` : ""}
        ${c.clientNotes ? `<p class="client-notes">${esc(c.clientNotes)}</p>` : `<p class="client-notes muted">Add context in the profile so the AI can tailor the message.</p>`}
      </div>`;
  }
  function onClientsChanged() { renderClientSelect(); renderClientSummary(); renderContext(); renderGuidance(); }

  const clientForm = $("clientForm"); let editingId = "";
  const clientInputs = [...clientForm.querySelectorAll("[data-key]")];
  function renderClientList() {
    $("clientList").innerHTML = clients.map((c) => `<li><button type="button" class="client-item${c.id === editingId ? " is-active" : ""}" data-client="${esc(c.id)}"><span class="client-avatar sm" aria-hidden="true">${esc(initials(c))}</span><span><strong>${esc(c.clientCompany || c.clientName || "Unnamed client")}</strong><small>${esc(c.clientName || c.clientEmail || "")}</small></span></button></li>`).join("");
  }
  function fillClientForm(c) {
    clientInputs.forEach((input) => { input.value = c[input.dataset.key] || (input.tagName === "SELECT" ? input.options[1]?.value || "" : ""); });
    $("clientFormTitle").textContent = c.id ? "Edit client" : "New client";
    $("deleteClientBtn").hidden = !c.id;
  }
  function openClients(mode) {
    editingId = mode === "new" ? "" : activeClientId;
    fillClientForm(mode === "new" ? {} : activeClient()); renderClientList(); openDrawer("clientsDrawer");
    setTimeout(() => $("cfName").focus(), 60);
  }
  $("clientList").addEventListener("click", (event) => { const btn = event.target.closest("[data-client]"); if (!btn) return; editingId = btn.dataset.client; fillClientForm(clients.find((c) => c.id === editingId) || {}); renderClientList(); });
  $("newClientBtn").addEventListener("click", () => { editingId = ""; fillClientForm({}); renderClientList(); $("cfName").focus(); });
  clientForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = {}; clientInputs.forEach((input) => { data[input.dataset.key] = input.value.trim(); });
    if (!data.clientName && !data.clientCompany) { toast("Add a contact name or company first.", "error"); $("cfName").focus(); return; }
    if (editingId) { clients = clients.map((c) => (c.id === editingId ? { ...c, ...data } : c)); }
    else { editingId = `c-${Date.now().toString(36)}`; clients.push({ id: editingId, ...data }); }
    activeClientId = editingId; saveClients(); onClientsChanged(); renderClientList(); fillClientForm(activeClient());
    toast(`Saved ${data.clientCompany || data.clientName}.`, "ok");
  });
  $("deleteClientBtn").addEventListener("click", () => {
    const c = clients.find((x) => x.id === editingId); if (!c) return;
    if (!window.confirm(`Delete ${c.clientCompany || c.clientName}? This can't be undone.`)) return;
    clients = clients.filter((x) => x.id !== editingId);
    if (activeClientId === editingId) activeClientId = clients[0]?.id || "";
    editingId = activeClientId; saveClients(); onClientsChanged(); renderClientList(); fillClientForm(activeClient());
    toast("Client deleted.");
  });
  els.client.addEventListener("change", () => { activeClientId = els.client.value; saveClients(); renderClientSummary(); renderContext(); renderGuidance(); });
  els.clientSummary.addEventListener("click", (event) => { const btn = event.target.closest("[data-open-clients]"); if (btn) openClients(btn.dataset.openClients); });
  $("openClients").addEventListener("click", () => openClients("edit"));

  // ---- drawers, menu, modal -----------------------------------------------
  let lastFocus = null;
  function openDrawer(id) { lastFocus = document.activeElement; const d = $(id); d.classList.add("is-open"); d.setAttribute("aria-hidden", "false"); document.body.classList.add("no-scroll"); }
  function closeDrawer(id) { const d = $(id); if (!d.classList.contains("is-open")) return; d.classList.remove("is-open"); d.setAttribute("aria-hidden", "true"); if (!document.querySelector(".drawer.is-open") && $("reviewModal").hidden) document.body.classList.remove("no-scroll"); lastFocus?.focus?.(); }

  const accountMenu = $("accountMenu"), avatarBtn = $("avatarBtn");
  function setMenu(open) { accountMenu.hidden = !open; avatarBtn.setAttribute("aria-expanded", String(open)); }
  avatarBtn.addEventListener("click", (event) => { event.stopPropagation(); setMenu(accountMenu.hidden); });
  document.addEventListener("click", (event) => { if (!accountMenu.hidden && !event.target.closest(".account")) setMenu(false); });
  accountMenu.addEventListener("click", (event) => {
    const item = event.target.closest("[data-account]"); if (!item) return; setMenu(false);
    if (item.dataset.account === "clients") openClients("edit");
    else if (item.dataset.account === "ranking") openOrgRanking();
    else { openSetup(); if (item.dataset.account === "shortcuts") setTimeout(() => $("shortcutsSection").scrollIntoView({ behavior: "smooth", block: "start" }), 120); }
  });

  document.addEventListener("click", (event) => {
    const closer = event.target.closest("[data-close]"); if (!closer) return;
    const which = closer.dataset.close;
    if (which === "review") closeReview(); else if (which === "sms") closeSms(); else closeDrawer(`${which}Drawer`);
  });


  // ---- AI panel -----------------------------------------------------------
  const mobileQuery = window.matchMedia("(max-width: 1100px)");
  function setPanel(open, remember = true) {
    document.body.classList.toggle("ai-open", open); els.panelToggle.setAttribute("aria-expanded", String(open));
    if (remember && !mobileQuery.matches) store.set(KEYS.panel, open);
    if (open && mobileQuery.matches) setTimeout(() => els.note.focus(), 250);
  }
  els.panelToggle.addEventListener("click", () => { const open = !document.body.classList.contains("ai-open"); setPanel(open); if (open) els.note.focus({ preventScroll: true }); });
  els.panelClose.addEventListener("click", () => setPanel(false));
  els.scrim.addEventListener("click", () => setPanel(false));
  $("ctxSetup").addEventListener("click", () => openSetup());

  function renderContext() {
    const c = activeClient();
    els.ctxClient.textContent = c.clientCompany || c.clientName || "No client";
    els.ctxProduct.textContent = deal.product ? `${displayPair(deal.pair)} · ${deal.product}` : "No product";
    els.ctxStyle.textContent = `${prefs.writingStyle || "Custom"} · ${prefs.tone || "custom tone"}`;
  }
  function renderGuidance() {
    const c = activeClient(); const copy = termsheetCopy(deal.product, deal.pair, deal.notionalCcy);
    els.guidanceMarketWhy.textContent = prefs.advisorGuidance || "Only the rationale in your key points.";
    const bits = [c.clientCompany || c.clientName, c.riskAppetite && c.riskAppetite !== "Not set" && `${c.riskAppetite.toLowerCase()} risk appetite`, c.hedgingHorizon && c.hedgingHorizon !== "Not set" && `${c.hedgingHorizon.toLowerCase()} horizon`].filter(Boolean);
    els.guidanceClientWhy.textContent = bits.length ? `${bits.join(" · ")}.${c.clientNotes ? ` ${c.clientNotes}` : ""}` : "Complete the client profile to tailor the message.";
    els.guidanceProductWhy.textContent = copy.benefits[0] || copy.outline[0] || "Choose a structure to see its rationale.";
  }

  function buildPayload(note) {
    const copy = termsheetCopy(deal.product, deal.pair, deal.notionalCcy); const c = activeClient();
    const dealTerms = { Pair: deal.pair, Direction: deal.direction, Notional: deal.notional };
    dynamicFieldsFor(getSchema(deal.product)).forEach((field) => { if (deal.fields[field.key]) dealTerms[field.label] = deal.fields[field.key]; });
    return {
      product: deal.product, product_family: deal.productFamily, deal_terms: dealTerms, product_outline: copy.outline, product_benefits: copy.benefits, product_risks: copy.risks, advisor_note: note,
      client_name: c.clientName || null, client_company: c.clientCompany || null, client_industry: c.clientIndustry || null, client_risk_appetite: c.riskAppetite || null,
      client_hedging_horizon: c.hedgingHorizon || null, client_functional_currency: c.functionalCurrency || null, client_notes: c.clientNotes || null,
      writing_style: prefs.writingStyle || null, tone: prefs.tone || null, sales_positioning: prefs.salesPositioning || null, advisor_guidance: prefs.advisorGuidance || null,
      suggest_subject: !!els.toggleSubject.checked, show_alternative: !!els.toggleAlt.checked,
    };
  }
  async function draftNote(note) {
    // The built-in page uses the keyless, rate-limited UI endpoint; integrations use /v1/ai/sales-message with a key.
    const response = await fetch("/v1/ui/sales-message", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(buildPayload(note)) });
    if (!response.ok) {
      let detail = response.statusText;
      try { const body = await response.json(); detail = typeof body.detail === "string" ? body.detail : Array.isArray(body.detail) ? body.detail.map((d) => d.msg).join("; ") : detail; } catch (_e) {}
      throw new Error(detail || `HTTP ${response.status}`);
    }
    const data = await response.json();
    return { message: String(data.message || "").trim(), subject: data.subject ? String(data.subject).trim() : "", alternative: data.alternative_message ? String(data.alternative_message).trim() : "" };
  }

  function indicatorBand(score) { return score < 2.3 ? "red" : score < 3.8 ? "amber" : "green"; }
  async function rankSalesMessage(message) {
    if (!message?.trim()) { rankingUI.card.hidden = true; setIntroRanking(""); return; }
    setIntroRanking("");
    rankingUI.card.hidden = false; rankingUI.card.className = "ranking-card is-loading";
    rankingUI.title.textContent = "Evaluating message…"; rankingUI.score.textContent = "";
    rankingUI.note.textContent = "Checking the organization’s indicators."; rankingUI.indicators.innerHTML = "";
    const client = activeClient();
    const clientContext = [client.clientNotes, client.riskAppetite, client.hedgingHorizon, client.clientIndustry].filter(Boolean).join("; ");
    const payload = buildPayload(els.note.value.trim() || message);
    const dealContext = JSON.stringify({ product: payload.product, product_family: payload.product_family, deal_terms: payload.deal_terms, product_outline: payload.product_outline, product_benefits: payload.product_benefits, product_risks: payload.product_risks });
    try {
      const response = await fetch("/v1/ui/rank-sales-message", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ message, indicators: orgRanking.indicators, client_context: clientContext, deal_context: dealContext }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || `HTTP ${response.status}`);
      setIntroRanking(data.band);
      rankingUI.card.className = `ranking-card is-${data.band}`;
      rankingUI.title.textContent = data.band === "green" ? "Strong sales positioning" : data.band === "amber" ? "Developing sales positioning" : "Poor sales positioning";
      rankingUI.score.textContent = `${Number(data.overall_score).toFixed(1)} / 5`;
      rankingUI.meter.setAttribute("aria-valuenow", String(data.overall_score));
      rankingUI.marker.style.left = `${Math.max(0, Math.min(100, Number(data.overall_score) / 5 * 100))}%`;
      rankingUI.note.textContent = `Equal-weight average across ${data.indicators.length} organization indicators.`;
      rankingUI.indicators.innerHTML = data.indicators.map((result) => {
        const indicator = orgRanking.indicators.find((item) => item.id === result.id);
        if (!indicator) return "";
        return `<li class="ranking-indicator is-${indicatorBand(result.score)}"><div><strong>${esc(indicator.name)}</strong><span>${result.score} / 5</span></div><p>${esc(result.evidence)}</p></li>`;
      }).join("");
    } catch (error) {
      setIntroRanking("");
      rankingUI.card.className = "ranking-card is-error"; rankingUI.title.textContent = "Ranking unavailable";
      rankingUI.note.textContent = error?.message || "Could not evaluate this message.";
    }
  }
  $("recheckRanking").addEventListener("click", () => rankSalesMessage(els.intro.value.trim()));
  els.intro.addEventListener("input", () => {
    if (!rankingUI.card.hidden && !rankingUI.card.classList.contains("is-loading")) {
      setIntroRanking("stale");
      rankingUI.card.classList.add("is-stale"); rankingUI.title.textContent = "Message edited";
      rankingUI.score.textContent = "Stale"; rankingUI.note.textContent = "Recheck the ranking to update the score for this version.";
    }
  });

  function setIntro(text) {
    els.intro.value = text; updateIntroCount();
    els.intro.classList.remove("flash"); void els.intro.offsetWidth; els.intro.classList.add("flash");
    if (mobileQuery.matches) { setPanel(false, false); setTimeout(() => els.intro.scrollIntoView({ behavior: "smooth", block: "center" }), 280); }
  }
  function updateIntroCount() { const n = wordCount(els.intro.value); els.introCount.textContent = `${n} word${n === 1 ? "" : "s"}`; }
  els.intro.addEventListener("input", updateIntroCount);

  const history = []; let historyIndex = -1; let pendingAlternative = "";
  function addHistoryDraft(message) {
    const product = deal.product || "Sales message";
    const sequence = history.filter((draft) => draft.product === product).reduce((max, draft) => Math.max(max, draft.sequence), 0) + 1;
    history.push({ message, product, sequence, name: `${product} draft ${sequence}` });
    historyIndex = history.length - 1;
  }
  function renderHistory() {
    if (!history.length) { els.history.hidden = true; els.historyChips.innerHTML = ""; els.historyCount.textContent = ""; return; }
    els.history.hidden = false; els.historyCount.textContent = `${history.length} saved`;
    els.historyChips.innerHTML = history.map((draft, i) => `<span class="draft-entry"><button type="button" class="pill${i === historyIndex ? " is-active" : ""}" data-i="${i}" title="${esc(draft.name)}" aria-pressed="${i === historyIndex}" data-testid="ai-history-draft-${i + 1}">${esc(draft.name)}</button><button type="button" class="draft-remove" data-delete-draft="${i}" aria-label="Delete ${esc(draft.name)}" title="Delete draft"><svg class="icon icon-xs" aria-hidden="true"><use href="#i-x"/></svg></button></span>`).join("");
  }
  function clearActiveDraft() {
    setIntro(""); setIntroRanking(""); els.subject.value = ""; suggestedSubject = ""; pendingAlternative = ""; els.alt.hidden = true; rankingUI.card.hidden = true;
  }
  els.historyChips.addEventListener("click", (event) => {
    const remove = event.target.closest("[data-delete-draft]");
    if (remove) {
      const index = Number(remove.dataset.deleteDraft); const wasActive = index === historyIndex;
      history.splice(index, 1);
      if (!history.length) { historyIndex = -1; renderHistory(); clearActiveDraft(); setStatus("Draft removed.", "ok"); return; }
      if (index < historyIndex) historyIndex -= 1;
      else if (wasActive) historyIndex = Math.min(index, history.length - 1);
      renderHistory();
      if (wasActive) { pendingAlternative = ""; els.alt.hidden = true; setIntro(history[historyIndex].message); rankSalesMessage(history[historyIndex].message); }
      setStatus("Draft removed.", "ok"); return;
    }
    const btn = event.target.closest("[data-i]"); if (!btn) return;
    historyIndex = Number(btn.dataset.i); pendingAlternative = ""; els.alt.hidden = true; setIntro(history[historyIndex].message); renderHistory();
    setStatus(`Restored ${history[historyIndex].name}.`, "ok"); rankSalesMessage(history[historyIndex].message);
  });

  els.draft.addEventListener("click", async () => {
    const note = els.note.value.trim();
    if (!note) { setStatus("Add a few key points first.", "error"); els.note.focus(); return; }
    if (!deal.product) { setStatus("Choose a structure first.", "error"); return; }
    rankingUI.card.hidden = true; setIntroRanking("");
    syncDealFromInputs(); els.draft.disabled = true; els.draft.classList.add("is-loading"); els.draftLabel.textContent = "Writing your message…"; setStatus("", ""); els.alt.hidden = true;
    try {
      const result = await draftNote(note);
      addHistoryDraft(result.message); setIntro(result.message); renderHistory();
      if (result.subject) {
        suggestedSubject = result.subject;
        els.subject.value = result.subject;
      }
      if (result.alternative) { pendingAlternative = result.alternative; els.altText.textContent = result.alternative; els.alt.hidden = false; }
      setStatus(result.subject ? `Added to Intro message. Suggested subject: “${result.subject}”` : "Added to Intro message. Edit it freely.", "ok");
      rankSalesMessage(result.message);
    } catch (error) { setStatus(`Couldn't draft: ${error?.message || "unknown error"}`, "error"); }
    finally { els.draft.disabled = false; els.draft.classList.remove("is-loading"); els.draftLabel.textContent = "Draft intro message"; }
  });
  els.useAlt.addEventListener("click", () => { if (!pendingAlternative) return; addHistoryDraft(pendingAlternative); setIntro(pendingAlternative); renderHistory(); els.alt.hidden = true; setStatus("Switched to the alternative.", "ok"); rankSalesMessage(pendingAlternative); });
  els.copyIntro.addEventListener("click", async () => {
    if (!els.intro.value.trim()) { toast("Nothing to copy yet.", "error"); return; }
    try { await navigator.clipboard.writeText(els.intro.value); toast("Intro message copied.", "ok"); } catch (_e) { toast("Couldn't copy. Select the text and copy it manually.", "error"); }
  });
  // ---- saved key points -----------------------------------------------------
  const sc = { chips: $("shortcutChips"), empty: $("shortcutEmpty"), saveBtn: $("saveShortcutBtn"), saveRow: $("shortcutSaveRow"), name: $("shortcutName"), confirm: $("shortcutConfirm"), cancel: $("shortcutCancel") };
  function saveShortcuts() { store.set(KEYS.shortcuts, shortcuts); }
  function renderShortcuts() {
    const current = els.note.value.trim();
    sc.empty.hidden = shortcuts.length > 0;
    sc.chips.innerHTML = shortcuts.map((s, i) => `<span class="shortcut${s.note === current ? " is-active" : ""}"><button type="button" class="shortcut-use" data-use="${i}" title="${esc(s.note)}" data-testid="ai-shortcut-use-${i + 1}"><svg class="icon icon-sm" aria-hidden="true"><use href="#i-bookmark"/></svg>${esc(s.name)}</button><button type="button" class="shortcut-del" data-del="${i}" aria-label="Delete ${esc(s.name)}" title="Delete" data-testid="ai-shortcut-delete-${i + 1}"><svg class="icon icon-xs" aria-hidden="true"><use href="#i-x"/></svg></button></span>`).join("");
    $("manageShortcuts").innerHTML = shortcuts.length ? shortcuts.map((s, i) => `<li><div><strong>${esc(s.name)}</strong><p>${esc(s.note)}</p></div><button type="button" class="icon-btn" data-del="${i}" aria-label="Delete ${esc(s.name)}"><svg class="icon" aria-hidden="true"><use href="#i-trash"/></svg></button></li>`).join("") : `<li class="empty">No saved key points yet. Save them from the AI Sales Message panel.</li>`;
  }
  function deleteShortcut(index) { const [removed] = shortcuts.splice(index, 1); saveShortcuts(); renderShortcuts(); if (removed) toast(`Deleted “${removed.name}”.`); }
  function openShortcutSave() {
    const note = els.note.value.trim(); if (!note) { setStatus("Type your key points first, then save them.", "error"); els.note.focus(); return; }
    sc.saveRow.hidden = false; sc.name.value = note.split("\n")[0].slice(0, 40); sc.name.focus(); sc.name.select();
  }
  function closeShortcutSave() { sc.saveRow.hidden = true; sc.name.value = ""; }
  function confirmShortcutSave() {
    const name = sc.name.value.trim(); const note = els.note.value.trim();
    if (!name) { sc.name.focus(); return; }
    if (!note) { closeShortcutSave(); setStatus("Type your key points first, then save them.", "error"); return; }
    const existing = shortcuts.findIndex((s) => s.name.toLowerCase() === name.toLowerCase());
    if (existing >= 0) shortcuts[existing] = { name, note }; else shortcuts.push({ name, note });
    saveShortcuts(); closeShortcutSave(); renderShortcuts();
    toast(existing >= 0 ? `Updated “${name}”.` : `Saved “${name}”. Reuse it on any product.`, "ok");
  }
  sc.saveBtn.addEventListener("click", openShortcutSave);
  sc.confirm.addEventListener("click", confirmShortcutSave);
  sc.cancel.addEventListener("click", closeShortcutSave);
  sc.name.addEventListener("keydown", (event) => { if (event.key === "Enter") { event.preventDefault(); confirmShortcutSave(); } else if (event.key === "Escape") { event.stopPropagation(); closeShortcutSave(); } });
  sc.chips.addEventListener("click", (event) => {
    const use = event.target.closest("[data-use]"), del = event.target.closest("[data-del]");
    if (use) { const s = shortcuts[Number(use.dataset.use)]; if (!s) return; els.note.value = s.note; renderShortcuts(); els.note.focus(); setStatus(`Loaded “${s.name}”. Draft it for ${deal.product || "this structure"}.`, "ok"); }
    else if (del) deleteShortcut(Number(del.dataset.del));
  });
  $("manageShortcuts").addEventListener("click", (event) => { const del = event.target.closest("[data-del]"); if (del) deleteShortcut(Number(del.dataset.del)); });
  els.note.addEventListener("input", renderShortcuts);

  // ---- AI setup -------------------------------------------------------------
  function syncPrefInputs() { Object.keys(prefEls).forEach((key) => { prefEls[key].value = prefs[key] || ""; }); }
  function renderRankingMethodology() {
    $("rankingMethodCount").textContent = `${orgRanking.indicators.length} active indicator${orgRanking.indicators.length === 1 ? "" : "s"}; all indicators have equal weight.`;
  }
  let rankingDraft = null;
  function captureRankingDraft() {
    if (!rankingDraft) return;
    rankingDraft = rankingDraft.map((indicator, index) => ({
      ...indicator,
      name: $(`rankingName${index}`)?.value.trim() || "",
      guidance: $(`rankingGuidance${index}`)?.value.trim() || "",
    }));
  }
  function renderOrgRanking() {
    $("orgRankingIndicators").innerHTML = rankingDraft.map((indicator, index) => `<section class="org-ranking-item">
      <div class="org-ranking-item-head"><strong>Indicator ${index + 1}</strong><button type="button" class="link-btn danger-link" data-remove-ranking="${index}" aria-label="Remove indicator ${index + 1}">Remove</button></div>
      <div class="field"><label for="rankingName${index}">Indicator name</label><input id="rankingName${index}" maxlength="120" value="${esc(indicator.name)}" data-testid="ranking-indicator-name-${index + 1}"></div>
      <div class="field"><label for="rankingGuidance${index}">What should score well?</label><textarea id="rankingGuidance${index}" rows="3" maxlength="500" data-testid="ranking-indicator-guidance-${index + 1}">${esc(indicator.guidance)}</textarea></div>
    </section>`).join("");
  }
  function openOrgRanking() {
    rankingDraft = orgRanking.indicators.map((indicator) => ({ ...indicator }));
    renderOrgRanking(); openDrawer("orgRankingDrawer");
  }
  function openSetup() { syncPrefInputs(); renderShortcuts(); renderRankingMethodology(); openDrawer("setupDrawer"); setTimeout(() => prefEls.writingStyle.focus(), 60); }
  $("openOrgRanking").addEventListener("click", () => { closeDrawer("setupDrawer"); openOrgRanking(); });
  $("addRankingIndicator").addEventListener("click", () => {
    captureRankingDraft();
    if (rankingDraft.length >= 20) { toast("You can configure up to 20 indicators.", "error"); return; }
    rankingDraft.push({ id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, name: "", guidance: "" }); renderOrgRanking();
    $(`rankingName${rankingDraft.length - 1}`).focus();
  });
  $("orgRankingIndicators").addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-ranking]"); if (!button) return;
    captureRankingDraft(); rankingDraft.splice(Number(button.dataset.removeRanking), 1); renderOrgRanking();
  });
  $("resetRanking").addEventListener("click", () => { rankingDraft = DEFAULT_RANKING_INDICATORS.map((indicator) => ({ ...indicator })); renderOrgRanking(); });
  $("saveRanking").addEventListener("click", () => {
    captureRankingDraft();
    if (!rankingDraft.length) { toast("Keep at least one ranking indicator.", "error"); return; }
    const incomplete = rankingDraft.findIndex((indicator) => !indicator.name || !indicator.guidance);
    if (incomplete >= 0) { toast("Complete each indicator name and scoring guidance.", "error"); $(`rankingName${incomplete}`).focus(); return; }
    orgRanking = { indicators: rankingDraft.map((indicator) => ({ ...indicator })) }; store.set(KEYS.ranking, orgRanking); renderRankingMethodology(); closeDrawer("orgRankingDrawer"); toast("Organization ranking indicators saved.", "ok");
  });
  $("saveSetup").addEventListener("click", () => {
    Object.keys(prefEls).forEach((key) => { prefs[key] = prefEls[key].value.trim(); });
    store.set(KEYS.prefs, prefs); renderContext(); renderGuidance(); closeDrawer("setupDrawer"); toast("AI setup saved.", "ok");
  });
  $("resetSetup").addEventListener("click", () => { prefs = { ...DEFAULT_PREFS }; syncPrefInputs(); store.set(KEYS.prefs, prefs); renderContext(); renderGuidance(); toast("AI setup reset to defaults."); });

  // ---- review & send --------------------------------------------------------
  let activeFormat = "full";
  const review = { modal: $("reviewModal"), to: $("reviewTo"), subject: $("reviewSubject"), intro: $("reviewIntro"), preview: $("dealPreview"), full: $("fmtTabFull"), highlights: $("fmtTabHighlights") };
  const sms = { modal: $("smsModal"), enabled: $("includeSms"), to: $("smsTo"), message: $("smsMessage"), count: $("smsCount"), error: $("smsError") };
  const attachmentInput = $("attachmentInput"), attachmentDropZone = $("attachmentDropZone"), attachmentList = $("attachmentList");
  let attachments = [];
  function formatFileSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    const units = ["KB", "MB", "GB", "TB"]; let value = bytes / 1024; let unit = 0;
    while (value >= 1024 && unit < units.length - 1) { value /= 1024; unit += 1; }
    return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[unit]}`;
  }
  function renderAttachments() {
    attachmentList.innerHTML = attachments.map((file, index) => `<li class="attachment-item"><svg class="icon icon-sm" aria-hidden="true"><use href="#i-copy"/></svg><span class="attachment-name" title="${esc(file.name)}">${esc(file.name)}</span><span class="attachment-size">${formatFileSize(file.size)}</span><button class="attachment-remove" type="button" data-remove-attachment="${index}" aria-label="Remove ${esc(file.name)}" title="Remove attachment"><svg class="icon icon-sm" aria-hidden="true"><use href="#i-x"/></svg></button></li>`).join("");
  }
  function addAttachments(fileList) { attachments.push(...Array.from(fileList || [])); renderAttachments(); }
  $("chooseAttachments").addEventListener("click", () => attachmentInput.click());
  attachmentDropZone.addEventListener("click", (event) => { if (!event.target.closest("button")) attachmentInput.click(); });
  attachmentInput.addEventListener("change", () => { addAttachments(attachmentInput.files); attachmentInput.value = ""; });
  ["dragenter", "dragover"].forEach((type) => attachmentDropZone.addEventListener(type, (event) => { event.preventDefault(); attachmentDropZone.classList.add("is-dragging"); }));
  ["dragleave", "dragend"].forEach((type) => attachmentDropZone.addEventListener(type, (event) => { event.preventDefault(); if (!attachmentDropZone.contains(event.relatedTarget)) attachmentDropZone.classList.remove("is-dragging"); }));
  attachmentDropZone.addEventListener("drop", (event) => { event.preventDefault(); attachmentDropZone.classList.remove("is-dragging"); addAttachments(event.dataTransfer?.files); });
  attachmentList.addEventListener("click", (event) => { const button = event.target.closest("[data-remove-attachment]"); if (!button) return; attachments.splice(Number(button.dataset.removeAttachment), 1); renderAttachments(); });
  function previewTerms() {
    return [{ label: "Direction", value: deal.direction }, { label: "Notional", value: deal.notional }, ...dynamicFieldsFor(getSchema(deal.product)).map((f) => ({ label: f.label, value: deal.fields[f.key] }))].filter((t) => t.value);
  }
  function renderPreview() {
    const copy = termsheetCopy(deal.product, deal.pair, deal.notionalCcy); const terms = previewTerms();
    const hero = `<div class="preview-hero"><div><span class="eyebrow">${esc(activeFormat === "full" ? "Full product terms" : deal.productFamily || "FX structure")}</span><h3>${esc(deal.product || "Choose a structure")}</h3></div><span class="pair-chip mono">${esc(displayPair(deal.pair) || "—")}</span></div>`;
    const grid = (list) => `<div class="term-grid">${list.map((t) => `<div class="term"><span>${esc(t.label)}</span><strong class="mono">${esc(t.value)}</strong></div>`).join("") || `<p class="empty">Add deal terms to build the preview.</p>`}</div>`;
    if (activeFormat === "highlights") {
      review.preview.innerHTML = `${hero}${grid(terms.slice(0, 6))}<div class="summary-row"><div class="summary benefit"><span>Primary benefit</span><p>${esc(copy.benefits[0] || "Not supplied")}</p></div><div class="summary risk"><span>Key trade-off</span><p>${esc(copy.risks[0] || "Not supplied")}</p></div></div>`;
    } else {
      review.preview.innerHTML = `${hero}${grid(terms.slice(0, 8))}<div class="summary-row three"><div class="summary"><span>Overview</span><p>${esc(copy.outline[0] || "Not supplied")}</p></div><div class="summary benefit"><span>Benefit</span><p>${esc(copy.benefits[0] || "Not supplied")}</p></div><div class="summary risk"><span>Risk</span><p>${esc(copy.risks[0] || "Not supplied")}</p></div></div>`;
    }
  }
  function setFormat(format) {
    activeFormat = format;
    [review.full, review.highlights].forEach((tab) => { const on = (tab === review.full) === (format === "full"); tab.classList.toggle("is-active", on); tab.setAttribute("aria-selected", String(on)); });
    renderPreview();
  }
  function openReview() {
    syncDealFromInputs(); const c = activeClient();
    review.to.innerHTML = c.id ? `<span class="client-avatar xs" aria-hidden="true">${esc(initials(c))}</span><span>${esc(c.clientCompany || c.clientName)}${c.clientEmail ? ` <small>&lt;${esc(c.clientEmail)}&gt;</small>` : ""}</span>` : `<span class="muted">No client selected</span>`;
    const subject = els.subject.value.trim() || suggestedSubject || `Your ${displayPair(deal.pair)} ${deal.product} — indicative terms`;
    els.subject.value = subject;
    review.subject.value = subject;
    review.intro.value = els.intro.value; setFormat("full");
    lastFocus = document.activeElement; review.modal.hidden = false; document.body.classList.add("no-scroll"); setTimeout(() => review.subject.focus(), 30);
  }
  function closeReview() { if (review.modal.hidden) return; review.modal.hidden = true; if (!document.querySelector(".drawer.is-open")) document.body.classList.remove("no-scroll"); lastFocus?.focus?.(); }
  function closeSms() { sms.modal.hidden = true; if (review.modal.hidden && !document.querySelector(".drawer.is-open")) document.body.classList.remove("no-scroll"); }
  function updateSmsCount() { sms.count.textContent = `${sms.message.value.length} / 200`; }
  sms.message.addEventListener("input", updateSmsCount);
  review.subject.addEventListener("input", () => { els.subject.value = review.subject.value; });
  review.intro.addEventListener("input", () => { els.intro.value = review.intro.value; updateIntroCount(); });
  review.full.addEventListener("click", () => setFormat("full")); review.highlights.addEventListener("click", () => setFormat("highlights"));
  $("openReview").addEventListener("click", openReview);
  sms.enabled.addEventListener("change", () => { $("sendBtn").lastChild.textContent = sms.enabled.checked ? "Review text & send" : "Send email"; });
  async function prepareSmsReview() {
    const client = activeClient();
    if (!client.clientPhone) { toast("Add a mobile number to the client profile first.", "error"); closeReview(); openClients("edit"); $("cfPhone").focus(); return; }
    const dealLink = window.location.href;
    sms.to.value = client.clientPhone;
    sms.message.value = ""; sms.error.textContent = "Creating a concise AI summary…"; sms.error.className = "hint"; updateSmsCount();
    sms.modal.hidden = false; document.body.classList.add("no-scroll");
    try {
      const response = await fetch("/v1/ui/sms-summary", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sales_pitch: review.intro.value.trim() || review.subject.value.trim(), deal_link: dealLink }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || `HTTP ${response.status}`);
      sms.message.value = String(data.message || "").slice(0, 200); sms.error.textContent = "Edit the message if needed, then send it with the email."; updateSmsCount();
    } catch (error) {
      sms.error.textContent = `Couldn't create the AI summary: ${error?.message || "unknown error"}`; sms.error.className = "hint is-error";
    }
  }
  $("sendBtn").addEventListener("click", async () => {
    if (!activeClient().id) { toast("Choose a client before sending.", "error"); return; }
    if (sms.enabled.checked) { await prepareSmsReview(); return; }
    const attachmentNote = attachments.length ? ` with ${attachments.length} attachment${attachments.length === 1 ? "" : "s"}` : "";
    closeReview(); toast(`Email to ${activeClient().clientCompany || activeClient().clientName}${attachmentNote} is ready. Delivery runs through the Trade Builder's email service.`, "ok");
  });
  $("sendEmailSmsBtn").addEventListener("click", () => {
    if (!sms.to.value.trim()) { sms.error.textContent = "Enter the client's mobile number."; sms.error.className = "hint is-error"; sms.to.focus(); return; }
    if (!sms.message.value.trim()) { sms.error.textContent = "Add an SMS summary before continuing."; sms.error.className = "hint is-error"; sms.message.focus(); return; }
    const client = activeClient(); const attachmentNote = attachments.length ? ` with ${attachments.length} email attachment${attachments.length === 1 ? "" : "s"}` : ""; closeSms(); closeReview();
    toast(`Email and text to ${client.clientCompany || client.clientName}${attachmentNote} are ready. Delivery runs through the Trade Builder's email and SMS services.`, "ok");
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (!accountMenu.hidden) { setMenu(false); avatarBtn.focus(); return; }
    if (!sms.modal.hidden) { closeSms(); return; }
    if (!review.modal.hidden) { closeReview(); return; }
    const open = document.querySelector(".drawer.is-open"); if (open) { closeDrawer(open.id); return; }
    if (mobileQuery.matches && document.body.classList.contains("ai-open")) setPanel(false);
  });

  // ---- dictation ------------------------------------------------------------
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition; let recognition = null; let listening = false;
  if (!SpeechRecognition) { els.mic.disabled = true; els.mic.title = "Dictation isn't supported in this browser."; }
  else {
    recognition = new SpeechRecognition(); recognition.continuous = true; recognition.interimResults = false; recognition.lang = navigator.language || "en-US";
    const stop = () => { listening = false; els.mic.classList.remove("is-live"); };
    recognition.onresult = (event) => { const parts = []; for (let i = event.resultIndex; i < event.results.length; i += 1) if (event.results[i].isFinal) parts.push(event.results[i][0].transcript); if (parts.length) { els.note.value = `${els.note.value ? `${els.note.value.trimEnd()} ` : ""}${parts.join(" ").trim()}`; renderShortcuts(); } };
    recognition.onend = stop;
    recognition.onerror = (event) => { if (event?.error && !["no-speech", "aborted"].includes(event.error)) setStatus(`Dictation error: ${event.error}`, "error"); stop(); };
    els.mic.addEventListener("click", () => { if (listening) { recognition.stop(); return; } try { recognition.start(); } catch (_e) {} listening = true; els.mic.classList.add("is-live"); setStatus("Listening… speak your key points.", ""); });
  }

  // ---- init -----------------------------------------------------------------
  [els.pair, els.direction, els.notional].forEach((input) => input.addEventListener("input", syncDealFromInputs));
  els.product.addEventListener("change", onProductChange);
  populateProductSelect();
  els.product.value = "Knock Out Conv. (LEV)" in (window.DEMO_PRODUCT_SCHEMAS || {}) ? "Knock Out Conv. (LEV)" : els.product.options[0]?.value || "";
  onProductChange(); onClientsChanged(); renderShortcuts(); updateIntroCount();
  setPanel(mobileQuery.matches ? false : store.get(KEYS.panel, true) !== false, false);
  mobileQuery.addEventListener?.("change", (e) => setPanel(e.matches ? false : store.get(KEYS.panel, true) !== false, false));
})();
