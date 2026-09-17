"use strict";

(function () {
  const $ = (id) => document.getElementById(id);

  // ------------------------------------------------------------------ //
  // Draft history controller — this is the part that ports into the   //
  // builder PWA as-is. Replace-with-history.                          //
  // ------------------------------------------------------------------ //
  class DraftHistory {
    constructor(initial) {
      this.items = [];
      this.current = -1;
      if (initial) this.push(initial);
    }
    push(text) {
      this.items.push(text);
      this.current = this.items.length - 1;
      return this.items.length - 1;
    }
    get index() { return this.current; }
    get count() { return this.items.length; }
    get active() { return this.items[this.current] ?? ""; }
    go(index) {
      if (index < 0 || index >= this.items.length) return null;
      this.current = index;
      return this.active;
    }
    back() { return this.go(this.current - 1); }
    forward() { return this.go(this.current + 1); }
  }

  // ------------------------------------------------------------------ //
  // Placeholder substitution — mirrors the builder's                   //
  // termsheetCopyForProduct()/baseCcy()/termCcy(): {PAIR}/{BASE}/       //
  // {QUOTE}/{NOTIONAL} are resolved from the pair + notional currency  //
  // on screen, never invented.                                        //
  // ------------------------------------------------------------------ //
  function baseCcy(pair) { return String(pair || "").slice(0, 3); }
  function termCcy(pair) { return String(pair || "").slice(3, 6); }

  function substPlaceholders(text, pair, notionalCcy) {
    const base = baseCcy(pair), quote = termCcy(pair);
    const notional = notionalCcy || quote;
    return String(text || "")
      .replace(/\{PAIR\}/g, base && quote ? `${base}/${quote}` : "")
      .replace(/\{BASE\}/g, base)
      .replace(/\{QUOTE\}/g, quote)
      .replace(/\{NOTIONAL\}/g, notional);
  }

  function getSchema(product) {
    return (window.DEMO_PRODUCT_SCHEMAS && window.DEMO_PRODUCT_SCHEMAS[product]) || null;
  }

  function termsheetCopyForProduct(product, pair, notionalCcy) {
    const schema = getSchema(product);
    const t = (schema && schema.termsheet) || {};
    const subst = (s) => substPlaceholders(s, pair, notionalCcy);
    return {
      outline: (t.outline || []).map(subst).filter(Boolean),
      benefits: (t.benefits || []).map(subst).filter(Boolean),
      risks: (t.risks || []).map(subst).filter(Boolean),
    };
  }

  function formatDefault(field, raw) {
    if (raw === undefined || raw === null || raw === "") return "";
    if (field.type === "currency" && typeof raw === "number") {
      return raw.toLocaleString("en-US");
    }
    return String(raw);
  }

  function fieldInputType(type) {
    if (type === "date") return "date";
    return "text";
  }

  function cleanLabel(label) {
    return String(label || "").replace(/:\s*$/, "").trim();
  }

  // Drop a product's own scheduleColumns field when it's just a same-named
  // restatement of the fixed global Notional field above (e.g. SWAP's
  // "Notional" column) — keep it when the product gives it its own real
  // term (e.g. FEC's "Protection").
  function dynamicFieldsFor(schema) {
    return (schema?.fields || [])
      .filter((f) => !(f.key === "notional" && cleanLabel(f.label).toLowerCase() === "notional"))
      .map((f) => ({ ...f, label: cleanLabel(f.label) }));
  }

  // ------------------------------------------------------------------ //
  // Deal context — mirrors the fields the builder has on screen at     //
  // Review & Send time: pair/direction/notional (fixed) plus each      //
  // product's own scheduleColumns-driven fields (dynamic).             //
  // ------------------------------------------------------------------ //
  const deal = {
    product: "",
    pair: "",
    direction: "Buy",
    notional: "",
    clientName: "Ada Novik",
    clientCompany: "Novik Trading",
    fields: {}, // dynamic, keyed by this product's scheduleColumns field key
  };

  // ------------------------------------------------------------------ //
  // Payload builder — single spot in the code where the request body   //
  // for POST /v1/ai/sales-message is composed.                         //
  // ------------------------------------------------------------------ //
  function buildPayload(note) {
    const schema = getSchema(deal.product);
    const copy = termsheetCopyForProduct(deal.product, deal.pair, deal.notionalCcy);
    const dealTerms = {
      Pair: deal.pair,
      Direction: deal.direction,
      Notional: deal.notional,
    };
    dynamicFieldsFor(schema).forEach((f) => {
      const v = deal.fields[f.key];
      if (v) dealTerms[f.label] = v;
    });
    return {
      product: deal.product,
      deal_terms: dealTerms,
      product_outline: copy.outline,
      product_benefits: copy.benefits,
      product_risks: copy.risks,
      advisor_note: note,
      client_name: deal.clientName || null,
      client_company: deal.clientCompany || null,
      suggest_subject: !!els.toggleSubject.checked,
      show_alternative: !!els.toggleAlt.checked,
    };
  }

  const API_URL = "/v1/ai/sales-message";

  async function draftNote(note) {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(buildPayload(note)),
    });
    if (!res.ok) {
      let detail = res.statusText;
      try {
        const body = await res.json();
        if (typeof body.detail === "string") detail = body.detail;
        else if (Array.isArray(body.detail)) detail = body.detail.map((d) => d.msg).join("; ");
      } catch (_e) {}
      throw new Error(detail);
    }
    const data = await res.json();
    return {
      message: String(data.message || "").trim(),
      subject: data.subject ? String(data.subject).trim() : "",
      alternative: data.alternative_message ? String(data.alternative_message).trim() : "",
    };
  }

  // ------------------------------------------------------------------ //
  // UI wiring                                                          //
  // ------------------------------------------------------------------ //
  const els = {
    product: $("dcProduct"), productMeta: $("dcProductMeta"),
    pair: $("dcPair"), direction: $("dcDirection"), notional: $("dcNotional"),
    clientName: $("dcClientName"), clientCompany: $("dcClientCompany"),
    dynamicFields: $("dcDynamicFields"),
    outlineWrap: $("dcOutlineWrap"), outline: $("dcOutline"),
    benefits: $("dcBenefits"), risks: $("dcRisks"),
    note: $("aiNote"), mic: $("micBtn"), draft: $("draftBtn"), draftLabel: $("draftBtnLabel"),
    toggleSubject: $("toggleSubject"), toggleAlt: $("toggleAlt"),
    status: $("aiStatus"), intro: $("demoIntro"), subject: $("demoSubject"),
    copyIntro: $("copyIntroBtn"),
    history: $("aiHistory"), historyChips: $("aiHistoryChips"), historyCount: $("aiHistoryCount"),
    alt: $("aiAlt"), altText: $("aiAltText"), useAlt: $("useAltBtn"),
    tradeString: $("demoTradeString"), emailTo: $("demoEmailTo"),
    fab: $("aiFab"), popup: $("aiPopup"), popupClose: $("aiPopupClose"),
    fmtTabFull: $("fmtTabFull"), fmtTabHighlights: $("fmtTabHighlights"),
    fmtChip: $("demoFmtChip"), fmtPlaceholder: $("demoFmtPlaceholder"),
  };

  // Floating popup open/close ------------------------------- //
  function openPopup() {
    els.popup.classList.add("is-open");
    els.popup.setAttribute("aria-hidden", "false");
    els.fab.classList.add("is-open");
    els.fab.setAttribute("aria-expanded", "true");
    els.note.focus();
  }
  function closePopup() {
    els.popup.classList.remove("is-open");
    els.popup.setAttribute("aria-hidden", "true");
    els.fab.classList.remove("is-open");
    els.fab.setAttribute("aria-expanded", "false");
  }
  els.fab.addEventListener("click", () => {
    if (els.popup.classList.contains("is-open")) closePopup();
    else openPopup();
  });
  els.popupClose.addEventListener("click", closePopup);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && els.popup.classList.contains("is-open")) closePopup();
  });
  document.addEventListener("click", (e) => {
    if (!els.popup.classList.contains("is-open")) return;
    if (e.target.closest(".ai-fab-root")) return;
    closePopup();
  });

  function syncDealFromInputs() {
    deal.pair = els.pair.value.trim();
    deal.direction = els.direction.value.trim();
    deal.notional = els.notional.value.trim();
    deal.clientName = els.clientName.value.trim();
    deal.clientCompany = els.clientCompany.value.trim();
    els.dynamicFields.querySelectorAll("[data-field-key]").forEach((el) => {
      deal.fields[el.dataset.fieldKey] = el.value.trim();
    });
  }

  function renderGrounding() {
    const copy = termsheetCopyForProduct(deal.product, deal.pair, deal.notionalCcy);
    els.benefits.innerHTML = (copy.benefits.length ? copy.benefits : ["(none in this product's termsheet block)"]).map((x) => `<li>${escapeHtml(x)}</li>`).join("");
    els.risks.innerHTML = (copy.risks.length ? copy.risks : ["(none in this product's termsheet block)"]).map((x) => `<li>${escapeHtml(x)}</li>`).join("");
    if (copy.outline.length) {
      els.outlineWrap.hidden = false;
      els.outline.textContent = copy.outline.join(" ");
    } else {
      els.outlineWrap.hidden = true;
      els.outline.textContent = "";
    }
    els.tradeString.textContent = `${deal.pair || "—"} · ${deal.product}`;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function setStatus(text, kind) {
    els.status.textContent = text;
    els.status.className = "ai-status" + (kind ? " is-" + kind : "");
  }

  function populateProductSelect() {
    const names = Object.keys(window.DEMO_PRODUCT_SCHEMAS || {});
    els.product.innerHTML = names
      .map((n) => `<option value="${escapeHtml(n)}">${escapeHtml(n)}</option>`)
      .join("");
  }

  function renderDynamicFields() {
    const schema = getSchema(deal.product);
    const fields = dynamicFieldsFor(schema);
    deal.fields = {};
    els.dynamicFields.innerHTML = fields
      .map((f) => {
        const def = formatDefault(f, schema.sampleDefaults ? schema.sampleDefaults[f.key] : "");
        deal.fields[f.key] = def;
        const cls = f.type === "currency" || f.type === "rate" || f.type === "integer" ? " mono-field" : "";
        return `<div class="field"><label for="dcf-${escapeHtml(f.key)}">${escapeHtml(f.label)}</label>
          <input id="dcf-${escapeHtml(f.key)}" data-field-key="${escapeHtml(f.key)}" type="${fieldInputType(f.type)}" class="${cls}" value="${escapeHtml(def)}"></div>`;
      })
      .join("");
    els.dynamicFields.querySelectorAll("[data-field-key]").forEach((el) => {
      el.addEventListener("input", () => { deal.fields[el.dataset.fieldKey] = el.value.trim(); });
    });
  }

  function onProductChange() {
    const schema = getSchema(els.product.value);
    deal.product = els.product.value;
    deal.notionalCcy = schema?.notionalCcy || "";
    els.pair.value = schema?.pair || "";
    els.direction.value = deal.direction || "Buy";
    const notionalAmount = schema?.sampleDefaults?.notional;
    els.notional.value = notionalAmount
      ? `${deal.notionalCcy || ""} ${Number(notionalAmount).toLocaleString("en-US")}`.trim()
      : (deal.notionalCcy || "");
    els.productMeta.textContent = schema
      ? `${schema.classification || "n/a"} · ${schema.dropdownFamily || schema.family || ""}`
      : "";
    renderDynamicFields();
    syncDealFromInputs();
    renderGrounding();
  }

  // Draft history + result -------------------------------- //
  let history = new DraftHistory();

  function renderHistory() {
    if (history.count > 1) {
      els.history.hidden = false;
      els.historyChips.innerHTML = history.items
        .map((_, i) => {
          const current = i === history.index ? " is-current" : "";
          return `<button type="button" class="ai-chip${current}" data-i="${i}">Draft ${i + 1}</button>`;
        })
        .join("");
      els.historyCount.textContent = `${history.index + 1} of ${history.count}`;
      els.historyChips.querySelectorAll(".ai-chip").forEach((chip) => {
        chip.addEventListener("click", () => {
          const text = history.go(Number(chip.dataset.i));
          if (text != null) {
            els.intro.value = text;
            renderHistory();
            setStatus("Restored an earlier draft.", "ok");
          }
        });
      });
    } else {
      els.history.hidden = true;
    }
  }

  let pendingAlternative = "";

  els.draft.addEventListener("click", async () => {
    const note = els.note.value.trim();
    if (!note) {
      setStatus("Type or dictate a short note first.", "error");
      return;
    }
    syncDealFromInputs();
    els.draft.disabled = true;
    els.draftLabel.textContent = "Drafting…";
    setStatus("Contacting the AI…", "");
    els.alt.hidden = true;
    try {
      const result = await draftNote(note);
      history.push(result.message);
      els.intro.value = result.message;
      renderHistory();
      if (result.subject) els.subject.value = result.subject;
      if (result.alternative) {
        pendingAlternative = result.alternative;
        els.altText.textContent = result.alternative;
        els.alt.hidden = false;
      }
      setStatus(`Draft ready (${history.count} kept). Edit freely — nothing is sent until you hit Send Email.`, "ok");
    } catch (err) {
      setStatus(`Could not draft: ${err && err.message ? err.message : "unknown error"}`, "error");
    } finally {
      els.draft.disabled = false;
      els.draftLabel.textContent = "Draft with AI";
    }
  });

  els.useAlt.addEventListener("click", () => {
    if (!pendingAlternative) return;
    history.push(pendingAlternative);
    els.intro.value = pendingAlternative;
    renderHistory();
    els.alt.hidden = true;
    setStatus("Switched to the alternative draft.", "ok");
  });

  // Copy to clipboard ---------------------------------------- //
  els.copyIntro.addEventListener("click", async () => {
    const text = els.intro.value;
    if (!text.trim()) {
      setStatus("Nothing to copy yet.", "error");
      return;
    }
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setStatus("Copied to clipboard.", "ok");
    } catch (_e) {
      setStatus("Could not copy — select and copy manually.", "error");
    }
  });

  // Dictation ----------------------------------------------- //
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = null;
  let listening = false;

  if (!SR) {
    els.mic.disabled = true;
    els.mic.title = "Dictation is not supported in this browser — type the note instead.";
  } else {
    recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = navigator.language || "en-US";

    recognition.onresult = (event) => {
      const parts = [];
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        if (event.results[i].isFinal) parts.push(event.results[i][0].transcript);
      }
      if (parts.length) {
        els.note.value = (els.note.value ? els.note.value.trimEnd() + " " : "") + parts.join(" ").trim();
      }
    };
    recognition.onend = () => {
      listening = false;
      els.mic.classList.remove("is-live");
      els.mic.title = "Dictate the note";
    };
    recognition.onerror = (event) => {
      if (event && event.error && event.error !== "no-speech" && event.error !== "aborted") {
        setStatus(`Dictation error: ${event.error}`, "error");
      }
      listening = false;
      els.mic.classList.remove("is-live");
      els.mic.title = "Dictate the note";
    };

    els.mic.addEventListener("click", () => {
      if (listening) {
        recognition.stop();
      } else {
        try { recognition.start(); }
        catch (_e) { /* already started — ignore */ }
        listening = true;
        els.mic.classList.add("is-live");
        els.mic.title = "Stop dictating";
        setStatus("Listening… speak into the microphone.", "");
      }
    });
  }

  // Email format tabs — cosmetic only in this demo (Feature 2 is the AI    //
  // draft box; the full-termsheet/deal-highlights email layout itself     //
  // belongs to the builder's Review & Send screen, out of scope here).    //
  function setFormat(fmt) {
    const isFull = fmt === "full";
    els.fmtTabFull.classList.toggle("is-active", isFull);
    els.fmtTabFull.setAttribute("aria-selected", String(isFull));
    els.fmtTabHighlights.classList.toggle("is-active", !isFull);
    els.fmtTabHighlights.setAttribute("aria-selected", String(!isFull));
    els.fmtChip.textContent = isFull ? "FULL TERMSHEET" : "DEAL HIGHLIGHTS";
    els.fmtChip.classList.toggle("is-full", isFull);
    els.fmtChip.classList.toggle("is-highlights", !isFull);
    els.fmtPlaceholder.textContent = isFull
      ? "termsheet / chart preview renders here in the builder"
      : "key levels & payoff chart only — renders here in the builder";
    setStatus(
      isFull
        ? "Full termsheet format — complete pricing & legals go in the email."
        : "Deal highlights format — key levels & payoff only. Cosmetic in this demo; the AI Sales Message draft itself doesn't change.",
      "",
    );
  }
  els.fmtTabFull.addEventListener("click", () => setFormat("full"));
  els.fmtTabHighlights.addEventListener("click", () => setFormat("highlights"));

  // Mock modal buttons -------------------------------------- //
  $("cancelDemo").addEventListener("click", () => {
    setStatus("Demo only — nothing was sent.", "");
  });
  $("mockSend").addEventListener("click", () => {
    const body = els.intro.value.trim();
    setStatus(
      body
        ? "Demo only — email not really sent. In the builder this button issues the termsheet email with your Intro message."
        : "No intro message yet. Draft one with AI or type it, then Send.",
      body ? "ok" : "error",
    );
  });

  // Init ------------------------------------------------------ //
  populateProductSelect();
  els.product.value = "Knock Out Conv. (LEV)" in (window.DEMO_PRODUCT_SCHEMAS || {})
    ? "Knock Out Conv. (LEV)"
    : els.product.options[0]?.value || "";
  els.clientName.value = deal.clientName;
  els.clientCompany.value = deal.clientCompany;
  els.emailTo.textContent = deal.clientCompany + " — " + deal.clientName;
  els.product.addEventListener("change", onProductChange);
  onProductChange();
})();
