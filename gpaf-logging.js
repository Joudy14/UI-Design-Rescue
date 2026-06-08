/**
 * GPAF Logging Add-on for "UI Design Rescue"
 * ------------------------------------------------------------------
 * Emits play logs in the GPAF format (one JSON event per line / JSONL):
 *   session_start | score_update | level_complete | session_end
 *
 * Now includes a one-time CONSENT dialog (KVKK / GDPR): logging stays
 * OFF until the player agrees. The choice is remembered in the browser.
 *
 * HOW TO INSTALL (one line):
 *   In index.html, just before </body> and AFTER your existing
 *   <script src="script.js?v=4" defer></script>, add:
 *
 *       <script src="gpaf-logging.js" defer></script>
 *
 * It does NOT modify your game code.
 *
 * BEFORE THE REAL PLAY PHASE: set GAME_ID below to the GM-... code that
 * the Team tool shows you after you import your proposal + add member IDs.
 *
 * TESTING TIP: to see the consent box again, clear the site's storage
 * (DevTools > Application > Local Storage) or run
 *   localStorage.removeItem('gpaf_consent')
 */
(function () {
  "use strict";

  /* ====== CONFIG — set this to your real code before publishing ====== */
  var GAME_ID = "GM-PENDING";
  /* =================================================================== */

  var STORAGE_KEY = "gpaf_logs_buffer";
  var CONSENT_KEY = "gpaf_consent";
  var events = [];
  var playerPseudoId = null;
  var sessionId = null;
  var sessionStarted = false;
  var sessionEnded = false;
  var lastLoggedLevel = 0;
  var loggingEnabled = false; // flipped on only after consent

  function nowISO() { return new Date().toISOString(); }
  function uid(prefix) { return prefix + Math.random().toString(36).slice(2, 9); }

  function logEvent(type, payload) {
    if (!loggingEnabled || !playerPseudoId) return; // consent gate
    events.push({
      ts: nowISO(),
      playerPseudoId: playerPseudoId,
      sessionId: sessionId,
      gameId: GAME_ID,
      eventType: type,
      payload: payload || {},
    });
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(events)); } catch (e) {}
  }

  function currentScore() {
    var el = document.getElementById("tbScore");
    var n = el ? parseInt(el.textContent, 10) : NaN;
    return isNaN(n) ? 0 : n;
  }

  function currentLevel() {
    var bar = document.getElementById("levelTitleBar");
    var m = bar && bar.textContent.match(/Level\s+(\d+)/i);
    return m ? parseInt(m[1], 10) : 0;
  }

  /* ---- 0. One-time consent dialog (shown on first load) ---- */
  function showConsentModal() {
    if (document.getElementById("gpafConsent")) return;
    var overlay = document.createElement("div");
    overlay.id = "gpafConsent";
    overlay.style.cssText =
      "position:fixed;inset:0;z-index:100000;display:flex;align-items:center;justify-content:center;" +
      "background:rgba(0,0,0,.6);backdrop-filter:blur(3px);padding:20px;";
    overlay.innerHTML =
      '<div role="dialog" aria-modal="true" aria-labelledby="gpafConsentTitle" ' +
      'style="max-width:440px;width:100%;background:#1b1b24;color:#f3f3f7;border-radius:16px;' +
      'padding:26px 24px;box-shadow:0 20px 60px rgba(0,0,0,.5);font-family:inherit;line-height:1.5;">' +
        '<h2 id="gpafConsentTitle" style="margin:0 0 12px;font-size:19px;">Before you play</h2>' +
        '<p style="margin:0 0 10px;font-size:14px;opacity:.9;">' +
          'This game can record your play (your scores and which levels you finish) ' +
          'under a <strong>pseudonymous code</strong> you choose — not your name or student number.</p>' +
        '<p style="margin:0 0 18px;font-size:14px;opacity:.9;">' +
          'Everything is stored <strong>only in this browser</strong>. Nothing is uploaded to any server. ' +
          'Logs are shared with your instructor only if you click <em>"Export my logs"</em> yourself. ' +
          '(KVKK / GDPR compliant.)</p>' +
        '<div style="display:flex;gap:10px;flex-wrap:wrap;">' +
          '<button type="button" id="gpafConsentYes" ' +
            'style="flex:1;min-width:150px;padding:12px 16px;border:none;border-radius:10px;cursor:pointer;' +
            'background:#7C3AED;color:#fff;font-size:15px;font-weight:600;">I agree — record my play</button>' +
          '<button type="button" id="gpafConsentNo" ' +
            'style="flex:1;min-width:120px;padding:12px 16px;border:1px solid rgba(255,255,255,.25);' +
            'border-radius:10px;cursor:pointer;background:transparent;color:#f3f3f7;font-size:15px;">' +
            'No, don\u2019t record</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);

    document.getElementById("gpafConsentYes").addEventListener("click", function () {
      try { localStorage.setItem(CONSENT_KEY, "granted"); } catch (e) {}
      loggingEnabled = true;
      overlay.remove();
    });
    document.getElementById("gpafConsentNo").addEventListener("click", function () {
      try { localStorage.setItem(CONSENT_KEY, "denied"); } catch (e) {}
      loggingEnabled = false;
      overlay.remove();
    });
  }

  /* ---- 1. Ask the player for their code on the intro screen ---- */
  function injectCodeField() {
    var box = document.querySelector(".intro-box");
    if (!box || document.getElementById("gpafCodeWrap")) return;
    var wrap = document.createElement("div");
    wrap.id = "gpafCodeWrap";
    wrap.style.cssText = "margin:14px auto 0;max-width:320px;text-align:center;";
    wrap.innerHTML =
      '<label for="gpafCode" style="display:block;font-size:13px;opacity:.8;margin-bottom:6px;">' +
      "Enter your player code (the same one you'll use in the Player tool)</label>" +
      '<input id="gpafCode" type="text" placeholder="e.g. p001" ' +
      'style="width:100%;padding:10px 12px;border-radius:10px;border:1px solid rgba(128,128,128,.4);' +
      'background:rgba(255,255,255,.06);color:inherit;font-size:15px;text-align:center;" />';
    box.appendChild(wrap);
  }

  function resolvePlayerCode() {
    var input = document.getElementById("gpafCode");
    var code = input && input.value.trim();
    if (!code) {
      try { code = window.prompt("Enter your player code (e.g. p001):") || ""; } catch (e) { code = ""; }
      code = code.trim();
    }
    if (!code) code = uid("p"); // last-resort fallback so a session is never lost
    return code;
  }

  /* ---- 2. Start the session when the player clicks Start ---- */
  function startSession() {
    if (sessionStarted) return;
    playerPseudoId = resolvePlayerCode();
    sessionId = uid("s");
    sessionStarted = true;
    sessionEnded = false;
    events = [];
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    logEvent("session_start", {});
  }

  /* ---- 3. Log each level completion + running score (via the Next button) ---- */
  function onLevelAdvance() {
    if (!sessionStarted) return;
    var lvl = currentLevel();
    if (lvl && lvl !== lastLoggedLevel) {
      lastLoggedLevel = lvl;
      logEvent("score_update", { score: currentScore() });
      logEvent("level_complete", { level: lvl });
    }
  }

  /* ---- 4. End the session when the final screen appears ---- */
  function onFinalScreen() {
    if (!sessionStarted || sessionEnded) return;
    sessionEnded = true;
    var finalEl = document.getElementById("fScoreNum");
    var finalScore = finalEl ? parseInt(finalEl.textContent, 10) : currentScore();
    logEvent("score_update", { score: isNaN(finalScore) ? currentScore() : finalScore });
    logEvent("session_end", { completed: true });
    showExportButton();
  }

  /* ---- 5. Export everything as a .jsonl file ---- */
  function exportLogs() {
    if (!events.length) { alert("No events recorded yet — agree to recording and play a session first."); return; }
    var jsonl = events.map(function (e) { return JSON.stringify(e); }).join("\n");
    var blob = new Blob([jsonl], { type: "application/x-ndjson" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "gpaf_logs_" + (playerPseudoId || "player") + "_" + (sessionId || "s") + ".jsonl";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  function showExportButton() {
    if (document.getElementById("gpafExportBtn")) return;
    var btn = document.createElement("button");
    btn.id = "gpafExportBtn";
    btn.type = "button";
    btn.textContent = "\u2b07 Export my logs";
    btn.style.cssText =
      "position:fixed;right:16px;bottom:16px;z-index:99999;padding:12px 18px;border:none;" +
      "border-radius:12px;background:#7C3AED;color:#fff;font-size:15px;font-weight:600;" +
      "cursor:pointer;box-shadow:0 6px 20px rgba(0,0,0,.3);";
    btn.addEventListener("click", exportLogs);
    document.body.appendChild(btn);
  }

  /* ---- Wire up listeners (IDs are stable in your game) ---- */
  function init() {
    // Consent first — logging stays off until granted.
    var saved = null;
    try { saved = localStorage.getItem(CONSENT_KEY); } catch (e) {}
    if (saved === "granted") loggingEnabled = true;
    else if (saved === "denied") loggingEnabled = false;
    else showConsentModal();

    injectCodeField();

    var startBtn = document.getElementById("btnIntroStart");
    if (startBtn) startBtn.addEventListener("click", startSession);

    var nextBtn = document.getElementById("btnNext");
    if (nextBtn) nextBtn.addEventListener("click", function () { setTimeout(onLevelAdvance, 50); });

    var finalScreen = document.getElementById("finalScreen");
    if (finalScreen) {
      new MutationObserver(function () {
        if (finalScreen.style.display && finalScreen.style.display !== "none") onFinalScreen();
      }).observe(finalScreen, { attributes: true, attributeFilter: ["style"] });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();