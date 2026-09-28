"use strict";

(function () {
  const $ = (id) => document.getElementById(id);
  const KEYS = {
    clients: "foundryfx.clients", activeClient: "foundryfx.activeClient", legacyProfile: "foundryfx.clientProfile",
    prefs: "foundryfx.aiPreferences", shortcuts: "foundryfx.keyPointShortcuts", panel: "foundryfx.aiPanelOpen",
  };
  const store = {
    get(key, fallback) { try { const raw = localStorage.getItem(key); return raw == null ? fallback : JSON.parse(raw); } catch (_e) { return fallback; } },
    set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (_e) { /* works without storage */ } },
  };

  const DEFAULT_CLIENTS = [
    { id: "c-novik", clientName: "Ada Novik", clientCompany: "Novik Trading", clientEmail: "ada.novik@example.com", clientIndustry: "Import & distribution", riskAppetite: "Balanced", hedgingHorizon: "3–12 months", functionalCurrency: "AUD", clientNotes: "Budget rate 0.7200 AUD/USD · needs USD 3m per month · hedges out 12 months." },
    { id: "c-harbour", clientName: "Tom Reyes", clientCompany: "Harbour Street Wines", clientEmail: "tom.reyes@example.com", clientIndustry: "Wine export", riskAppetite: "Conservative", hedgingHorizon: "Up to 3 months", functionalCurrency: "NZD", clientNotes: "Receives EUR from European distributors · wants certainty over the next two quarters." },
  ];
  const DEFAULT_PREFS = {
    writingStyle: "Executive",
    tone: "Consultative",
    salesPositioning: "Lead with the client's practical outcome, then make benefits and trade-offs explicit.",
    masterMktWhy: "Use only the market rationale supplied in the advisor note and deal context. Do not add external market commentary.",
    masterClientWhy: "Connect the stated client objective, risk appetite and hedging horizon to the proposed structure without inventing suitability claims.",
    masterProductWhy: "Explain the supplied product benefits and risks plainly. Preserve every rate, amount and condition exactly.",
  };

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
  let prefs = { ...DEFAULT_PREFS, ...(store.get(KEYS.prefs, {}) || {}) };
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
    notes: $("dealNotes"), intro: $("dealIntro"), introCount: $("introCount"), copyIntro: $("copyIntroBtn"),
    panel: $("aiPanel"), panelToggle: $("aiPanelToggle"), panelClose: $("aiPanelClose"), scrim: $("aiScrim"),
    ctxClient: $("ctxClient"), ctxProduct: $("ctxProduct"), ctxStyle: $("ctxStyle"),
    note: $("aiNote"), mic: $("micBtn"), draft: $("draftBtn"), draftLabel: $("draftBtnLabel"), status: $("aiStatus"),
    toggleSubject: $("toggleSubject"), toggleAlt: $("toggleAlt"), history: $("aiHistory"), historyChips: $("aiHistoryChips"), historyCount: $("aiHistoryCount"),
    alt: $("aiAlt"), altText: $("aiAltText"), useAlt: $("useAltBtn"),
    guidanceMarketWhy: $("guidanceMarketWhy"), guidanceClientWhy: $("guidanceClientWhy"), guidanceProductWhy: $("guidanceProductWhy"),
  };
  const prefEls = { writingStyle: $("prefWritingStyle"), tone: $("prefTone"), salesPositioning: $("prefPositioning"), masterMktWhy: $("prefMktWhy"), masterClientWhy: $("prefClientWhy"), masterProductWhy: $("prefProductWhy") };
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
    else { openSetup(); if (item.dataset.account === "shortcuts") setTimeout(() => $("shortcutsSection").scrollIntoView({ behavior: "smooth", block: "start" }), 120); }
  });

  document.addEventListener("click", (event) => {
    const closer = event.target.closest("[data-close]"); if (!closer) return;
    const which = closer.dataset.close;
    if (which === "review") closeReview(); else closeDrawer(`${which}Drawer`);
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
    document.querySelectorAll("[data-style]").forEach((b) => { const on = b.dataset.style === prefs.writingStyle; b.classList.toggle("is-active", on); b.setAttribute("aria-pressed", String(on)); });
  }
  function renderGuidance() {
    const c = activeClient(); const copy = termsheetCopy(deal.product, deal.pair, deal.notionalCcy);
    els.guidanceMarketWhy.textContent = prefs.masterMktWhy || "Only the rationale in your key points.";
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
      writing_style: prefs.writingStyle || null, tone: prefs.tone || null, sales_positioning: prefs.salesPositioning || null, master_mkt_why: prefs.masterMktWhy || null, master_client_why: prefs.masterClientWhy || null, master_product_why: prefs.masterProductWhy || null,
      suggest_subject: !!els.toggleSubject.checked, show_alternative: !!els.toggleAlt.checked,
    };
  }
  async function draftNote(note) {
    const response = await fetch("/v1/ai/sales-message", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(buildPayload(note)) });
    if (!response.ok) {
      let detail = response.statusText;
      try { const body = await response.json(); detail = typeof body.detail === "string" ? body.detail : Array.isArray(body.detail) ? body.detail.map((d) => d.msg).join("; ") : detail; } catch (_e) {}
      throw new Error(detail || `HTTP ${response.status}`);
    }
    const data = await response.json();
    return { message: String(data.message || "").trim(), subject: data.subject ? String(data.subject).trim() : "", alternative: data.alternative_message ? String(data.alternative_message).trim() : "" };
  }

  function setIntro(text) {
    els.intro.value = text; updateIntroCount();
    els.intro.classList.remove("flash"); void els.intro.offsetWidth; els.intro.classList.add("flash");
    if (mobileQuery.matches) { setPanel(false, false); setTimeout(() => els.intro.scrollIntoView({ behavior: "smooth", block: "center" }), 280); }
  }
  function updateIntroCount() { const n = wordCount(els.intro.value); els.introCount.textContent = `${n} word${n === 1 ? "" : "s"}`; }
  els.intro.addEventListener("input", updateIntroCount);

  const history = []; let historyIndex = -1; let pendingAlternative = "";
  function renderHistory() {
    if (history.length <= 1) { els.history.hidden = true; return; }
    els.history.hidden = false; els.historyCount.textContent = `${historyIndex + 1} of ${history.length}`;
    els.historyChips.innerHTML = history.map((_, i) => `<button type="button" class="pill${i === historyIndex ? " is-active" : ""}" data-i="${i}" data-testid="ai-history-draft-${i + 1}">Draft ${i + 1}</button>`).join("");
  }
  els.historyChips.addEventListener("click", (event) => { const btn = event.target.closest("[data-i]"); if (!btn) return; historyIndex = Number(btn.dataset.i); setIntro(history[historyIndex]); renderHistory(); setStatus(`Restored draft ${historyIndex + 1}.`, "ok"); });

  els.draft.addEventListener("click", async () => {
    const note = els.note.value.trim();
    if (!note) { setStatus("Add a few key points first.", "error"); els.note.focus(); return; }
    if (!deal.product) { setStatus("Choose a structure first.", "error"); return; }
    syncDealFromInputs(); els.draft.disabled = true; els.draft.classList.add("is-loading"); els.draftLabel.textContent = "Writing your message…"; setStatus("", ""); els.alt.hidden = true;
    try {
      const result = await draftNote(note);
      history.push(result.message); historyIndex = history.length - 1; setIntro(result.message); renderHistory();
      if (result.subject) suggestedSubject = result.subject;
      if (result.alternative) { pendingAlternative = result.alternative; els.altText.textContent = result.alternative; els.alt.hidden = false; }
      setStatus(result.subject ? `Added to Intro message. Suggested subject: “${result.subject}”` : "Added to Intro message. Edit it freely.", "ok");
    } catch (error) { setStatus(`Couldn't draft: ${error?.message || "unknown error"}`, "error"); }
    finally { els.draft.disabled = false; els.draft.classList.remove("is-loading"); els.draftLabel.textContent = "Draft intro message"; }
  });
  els.useAlt.addEventListener("click", () => { if (!pendingAlternative) return; history.push(pendingAlternative); historyIndex = history.length - 1; setIntro(pendingAlternative); renderHistory(); els.alt.hidden = true; setStatus("Switched to the alternative.", "ok"); });
  els.copyIntro.addEventListener("click", async () => {
    if (!els.intro.value.trim()) { toast("Nothing to copy yet.", "error"); return; }
    try { await navigator.clipboard.writeText(els.intro.value); toast("Intro message copied.", "ok"); } catch (_e) { toast("Couldn't copy. Select the text and copy it manually.", "error"); }
  });
  document.querySelectorAll("[data-style]").forEach((b) => b.addEventListener("click", () => { prefs.writingStyle = b.dataset.style; store.set(KEYS.prefs, prefs); renderContext(); }));

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
  function openSetup() { syncPrefInputs(); renderShortcuts(); openDrawer("setupDrawer"); setTimeout(() => prefEls.writingStyle.focus(), 60); }
  $("saveSetup").addEventListener("click", () => {
    Object.keys(prefEls).forEach((key) => { prefs[key] = prefEls[key].value.trim(); });
    store.set(KEYS.prefs, prefs); renderContext(); renderGuidance(); closeDrawer("setupDrawer"); toast("AI setup saved.", "ok");
  });
  $("resetSetup").addEventListener("click", () => { prefs = { ...DEFAULT_PREFS }; syncPrefInputs(); store.set(KEYS.prefs, prefs); renderContext(); renderGuidance(); toast("AI setup reset to defaults."); });

  // ---- review & send --------------------------------------------------------
  let activeFormat = "full";
  const review = { modal: $("reviewModal"), to: $("reviewTo"), subject: $("reviewSubject"), intro: $("reviewIntro"), preview: $("dealPreview"), full: $("fmtTabFull"), highlights: $("fmtTabHighlights") };
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
    review.subject.value = suggestedSubject || `Your ${displayPair(deal.pair)} ${deal.product} — indicative terms`;
    review.intro.value = els.intro.value; setFormat("full");
    lastFocus = document.activeElement; review.modal.hidden = false; document.body.classList.add("no-scroll"); setTimeout(() => review.subject.focus(), 30);
  }
  function closeReview() { if (review.modal.hidden) return; review.modal.hidden = true; if (!document.querySelector(".drawer.is-open")) document.body.classList.remove("no-scroll"); lastFocus?.focus?.(); }
  review.intro.addEventListener("input", () => { els.intro.value = review.intro.value; updateIntroCount(); });
  review.full.addEventListener("click", () => setFormat("full")); review.highlights.addEventListener("click", () => setFormat("highlights"));
  $("openReview").addEventListener("click", openReview);
  $("sendBtn").addEventListener("click", () => {
    if (!activeClient().id) { toast("Choose a client before sending.", "error"); return; }
    closeReview(); toast(`Email to ${activeClient().clientCompany || activeClient().clientName} is ready. Sending runs through the Trade Builder's email service.`, "ok");
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (!accountMenu.hidden) { setMenu(false); avatarBtn.focus(); return; }
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
