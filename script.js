// ═══════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════
let currentLevel  = 1;
let totalScore    = 0;
let levelScores   = { 1: 0, 2: 0, 3: 0 };
let combo         = 0;
let timerInterval = null;
let timeLeft      = 60;
let placedCount   = 0;
let totalPieces   = 0;

// ═══════════════════════════════════════════════════════
// LESSONS
// ═══════════════════════════════════════════════════════
const LEVEL_TIME = { 1: 60, 2: 55, 3: 50 };

const lessons = {
  1: {
    title:    "Login Screen UX",
    subtitle: "Users should instantly know how to sign in.",
    caption:  "Good login screens use clear hierarchy — logo first, then form, then CTA. Every element has one clear home.",
    good: [ "Logo anchors brand at the top", "Email → Password stacked vertically", "CTA button large and prominent", "Forgot password: subtle but accessible" ],
    bad:  [ "Elements scattered break reading flow", "No hierarchy confuses entry point", "CTA hidden or undersized", "Cluttered = abandoned form" ],
    image: "bg.jpg",
    // piece definitions: id, tray label, tray icon, zone it belongs to
    pieces: [
      { id: "p1logo",     label: "Brand Logo",          icon: "🎵", zone: "z1logo"     },
      { id: "p1email",    label: "Email Field",          icon: "✉️", zone: "z1email"    },
      { id: "p1password", label: "Password Field",       icon: "🔒", zone: "z1password" },
      { id: "p1btn",      label: "Login Button",         icon: "🟢", zone: "z1btn"      },
      { id: "p1forgot",   label: "Forgot Password Link", icon: "🔗", zone: "z1forgot"   },
    ],
  },
  2: {
    title:    "Checkout UX",
    subtitle: "Payment flows must feel trustworthy and clear.",
    caption:  "Users must see what they're paying for, where to enter card details, and have one clear action. Clutter kills conversions.",
    good: [ "Order summary before payment fields", "Card details grouped logically", "One big clear pay button", "Promo code subtle — not competing" ],
    bad:  [ "Pay button buried or tiny", "Order total hidden or unclear", "Too many sections competing", "No visual hierarchy = abandoned cart" ],
    image: "Checkout.jpg",
    pieces: [
      { id: "p2summary", label: "Order Summary",  icon: "🛒", zone: "z2summary" },
      { id: "p2card",    label: "Card Details",   icon: "💳", zone: "z2card"    },
      { id: "p2promo",   label: "Promo Code",     icon: "🎁", zone: "z2promo"   },
      { id: "p2pay",     label: "Pay Button",     icon: "💸", zone: "z2pay"     },
    ],
  },
  3: {
    title:    "Dashboard UX",
    subtitle: "Dashboards must be scannable in under 3 seconds.",
    caption:  "Navigation on the left, key metrics up top, profile accessible, primary action reachable. Hierarchy isn't optional.",
    good: [ "Sidebar anchored on left edge", "Key metrics near top", "User profile clearly visible", "Save / action button easy to reach" ],
    bad:  [ "Navigation mixed into content", "Stats buried or crowded", "No visual hierarchy", "Action buttons hidden below fold" ],
    image: "Dashboard.jpg",
    pieces: [
      { id: "p3sidebar",  label: "Navigation Sidebar", icon: "📊", zone: "z3sidebar" },
      { id: "p3profile",  label: "User Profile Card",  icon: "👤", zone: "z3profile" },
      { id: "p3stats",    label: "Sessions Metric",    icon: "📈", zone: "z3stats"   },
      { id: "p3revenue",  label: "Revenue Metric",     icon: "💰", zone: "z3revenue" },
      { id: "p3save",     label: "Save Button",        icon: "💾", zone: "z3save"    },
    ],
  },
};

const UX_HINTS = [
  "Users scan top to bottom, left to right — hierarchy matters.",
  "The primary CTA should always be the most visually dominant element.",
  "Group related content together — don't scatter it.",
  "Navigation belongs on edges, not competing with content.",
  "Decoy zones are traps — think about what belongs where logically.",
  "Form fields always stack vertically in login screens.",
  "Order summary comes before payment input — users want to verify first.",
  "Logos anchor at the very top — they're the first thing users look for.",
];

// ═══════════════════════════════════════════════════════
// DOM REFS
// ═══════════════════════════════════════════════════════
const introScreen  = document.getElementById("introScreen");
const teachScreen  = document.getElementById("teachScreen");
const gameScreen   = document.getElementById("gameScreen");
const finalScreen  = document.getElementById("finalScreen");
const strip        = document.getElementById("strip");
const stripText    = document.getElementById("stripText");
const tbScore      = document.getElementById("tbScore");
const tbTimer      = document.getElementById("tbTimer");
const timerRing    = document.getElementById("timerRing");
const comboWrap    = document.getElementById("comboWrap");
const comboBadge   = document.getElementById("comboBadge");
const trayItems    = document.getElementById("trayItems");
const tpPlaced     = document.getElementById("tpPlaced");
const tpTotal      = document.getElementById("tpTotal");
const tpFill       = document.getElementById("tpFill");
const trayHintText = document.getElementById("trayHintText");
const comboPop     = document.getElementById("comboPop");

// ═══════════════════════════════════════════════════════
// INTRO → TEACH
// ═══════════════════════════════════════════════════════
document.getElementById("btnIntroStart").onclick = () => {
  introScreen.style.display = "none";
  openTeachScreen(1);
};

// ═══════════════════════════════════════════════════════
// TEACH SCREEN
// ═══════════════════════════════════════════════════════
function openTeachScreen(level) {
  teachScreen.style.display = "flex";
  const L = lessons[level];

  document.getElementById("teachTag").innerText      = `Level ${level} of 3`;
  document.getElementById("teachTitle").innerText    = L.title;
  document.getElementById("teachSub").innerText      = L.subtitle;
  document.getElementById("teachCaption").innerText  = L.caption;
  document.getElementById("teachImg").src            = L.image;
  document.getElementById("teachTimerVal").innerText = `${LEVEL_TIME[level]}s`;

  const good = document.getElementById("teachGood");
  const bad  = document.getElementById("teachBad");
  good.innerHTML = bad.innerHTML = "";
  L.good.forEach(i => good.innerHTML += `<li>${i}</li>`);
  L.bad.forEach(i  => bad.innerHTML  += `<li>${i}</li>`);

  // Level pills
  for (let i = 1; i <= 3; i++) {
    const pill = document.getElementById(`pill${i}`);
    pill.className = "tb-pill" + (i < level ? " done" : i === level ? " active" : "");
  }
}

document.getElementById("btnTeachGo").onclick = () => {
  teachScreen.style.display = "none";
  gameScreen.style.display  = "flex";
  loadLevel(currentLevel);
};

// ═══════════════════════════════════════════════════════
// LOAD LEVEL
// ═══════════════════════════════════════════════════════
function loadLevel(level) {
  combo = 0;
  placedCount = 0;
  hideCombo();

  // Show correct device
  document.querySelectorAll(".devWrap").forEach(el => el.classList.add("hide"));
  document.getElementById(`lv${level}wrap`).classList.remove("hide");

  // Reset all zones in this level
  const wrap = document.getElementById(`lv${level}wrap`);
  wrap.querySelectorAll(".zone").forEach(z => {
    z.className = z.classList.contains("decoy") ? "zone decoy" : "zone";
  });

  // Build tray
  const L = lessons[level];
  totalPieces = L.pieces.length;
  tpTotal.innerText = totalPieces;
  tpPlaced.innerText = 0;
  tpFill.style.width = "0%";
  buildTray(level);

  // Hint
  trayHintText.innerText = UX_HINTS[Math.floor(Math.random() * UX_HINTS.length)];

  // Strip
  setStrip("neutral", "🎯 Drag elements from the tray onto the correct spots. Beware of decoy zones!");

  // Hide/reset buttons
  document.getElementById("btnNext").classList.add("hide");
  document.getElementById("btnSubmit").disabled = false;

  // Start timer
  startTimer(level);
}

// ═══════════════════════════════════════════════════════
// TRAY
// ═══════════════════════════════════════════════════════
function buildTray(level) {
  trayItems.innerHTML = "";
  // Shuffle pieces so order is random (harder)
  const pieces = [...lessons[level].pieces].sort(() => Math.random() - 0.5);
  pieces.forEach(p => {
    const div = document.createElement("div");
    div.className = "tray-piece";
    div.id = `tray_${p.id}`;
    div.dataset.pieceId = p.id;
    div.innerHTML = `
      <span class="tray-piece-icon">${p.icon}</span>
      <span class="tray-piece-name">${p.label}</span>
      <span class="tray-piece-grip">⠿⠿</span>
    `;
    div.addEventListener("mousedown",  e => startTrayDrag(e, p));
    div.addEventListener("touchstart", e => startTrayDragTouch(e, p), { passive: false });
    trayItems.appendChild(div);
  });
}

// ═══════════════════════════════════════════════════════
// TIMER
// ═══════════════════════════════════════════════════════
const CIRCUMFERENCE = 2 * Math.PI * 15.9; // ~99.9

function startTimer(level) {
  clearInterval(timerInterval);
  timeLeft = LEVEL_TIME[level];
  updateTimerDisplay(timeLeft, LEVEL_TIME[level]);

  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay(timeLeft, LEVEL_TIME[level]);

    if (timeLeft <= 10) {
      tbTimer.classList.add("urgent");
      timerRing.style.stroke = "#EF4444";
      if (timeLeft <= 5) setStrip("time", `⏰ Only ${timeLeft} seconds left!`);
    }

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timeUp();
    }
  }, 1000);
}

function updateTimerDisplay(t, max) {
  tbTimer.innerText = t;
  const pct = t / max;
  timerRing.style.strokeDashoffset = CIRCUMFERENCE * (1 - pct);
  timerRing.style.strokeDasharray  = CIRCUMFERENCE;
}

function timeUp() {
  tbTimer.innerText = "0";
  setStrip("warn", "⏰ Time's up! Submitting what you have...");
  document.getElementById("btnSubmit").click();
}

// ═══════════════════════════════════════════════════════
// FLOATING DRAG PIECE (tray → device)
// ═══════════════════════════════════════════════════════
let dragPiece = null;   // current piece meta { id, zone }
let floatEl   = null;   // the floating DOM element
let dragOffX  = 0;
let dragOffY  = 0;

function createFloatEl(pieceId) {
  // Build a mini float card
  const el = document.createElement("div");
  el.id = "floatPiece";
  el.style.cssText = `
    position:fixed; z-index:9999; pointer-events:none;
    background:var(--surface); border:2px solid var(--violet);
    border-radius:10px; padding:10px 14px;
    font-family:'DM Sans',sans-serif; font-size:13px; font-weight:600;
    color:var(--text); box-shadow:var(--shadow-lg);
    display:flex; align-items:center; gap:8px;
    white-space:nowrap; opacity:0.95;
    transform:scale(1.04) rotate(1.5deg);
  `;

  const L = lessons[currentLevel];
  const meta = L.pieces.find(p => p.id === pieceId);
  if (meta) {
    el.innerHTML = `<span style="font-size:18px">${meta.icon}</span><span>${meta.label}</span>`;
  }
  document.body.appendChild(el);
  return el;
}

function positionFloat(x, y) {
  if (!floatEl) return;
  floatEl.style.left = (x - dragOffX) + "px";
  floatEl.style.top  = (y - dragOffY) + "px";
}

function startTrayDrag(e, pieceMeta) {
  e.preventDefault();
  dragPiece = pieceMeta;
  dragOffX  = 20;
  dragOffY  = 20;

  floatEl = createFloatEl(pieceMeta.id);
  positionFloat(e.clientX, e.clientY);

  const card = document.getElementById(`tray_${pieceMeta.id}`);
  if (card) card.classList.add("dragging-from-tray");

  // Highlight valid zone on device
  highlightTargetZone(pieceMeta.zone);

  document.addEventListener("mousemove", onTrayDragMove);
  document.addEventListener("mouseup",   onTrayDragEnd);
}

function onTrayDragMove(e) {
  positionFloat(e.clientX, e.clientY);
  checkZoneHover(e.clientX, e.clientY);
}

function onTrayDragEnd(e) {
  document.removeEventListener("mousemove", onTrayDragMove);
  document.removeEventListener("mouseup",   onTrayDragEnd);
  if (!dragPiece) return;

  tryDrop(e.clientX, e.clientY);
  cleanup();
}

// TOUCH
function startTrayDragTouch(e, pieceMeta) {
  e.preventDefault();
  dragPiece = pieceMeta;
  const t = e.touches[0];
  dragOffX = 20; dragOffY = 20;

  floatEl = createFloatEl(pieceMeta.id);
  positionFloat(t.clientX, t.clientY);

  const card = document.getElementById(`tray_${pieceMeta.id}`);
  if (card) card.classList.add("dragging-from-tray");
  highlightTargetZone(pieceMeta.zone);

  document.addEventListener("touchmove",  onTrayDragMoveTouch, { passive: false });
  document.addEventListener("touchend",   onTrayDragEndTouch);
}

function onTrayDragMoveTouch(e) {
  e.preventDefault();
  const t = e.touches[0];
  positionFloat(t.clientX, t.clientY);
  checkZoneHover(t.clientX, t.clientY);
}

function onTrayDragEndTouch(e) {
  document.removeEventListener("touchmove",  onTrayDragMoveTouch);
  document.removeEventListener("touchend",   onTrayDragEndTouch);
  if (!dragPiece) return;
  const t = e.changedTouches[0];
  tryDrop(t.clientX, t.clientY);
  cleanup();
}

function cleanup() {
  if (floatEl) { floatEl.remove(); floatEl = null; }
  if (dragPiece) {
    const card = document.getElementById(`tray_${dragPiece.id}`);
    if (card) card.classList.remove("dragging-from-tray");
  }
  clearZoneHighlights();
  dragPiece = null;
}

// ═══════════════════════════════════════════════════════
// ZONE HOVER HIGHLIGHT
// ═══════════════════════════════════════════════════════
function highlightTargetZone(zoneId) {
  // Subtle glow on the target zone only (not decoys)
  const z = document.getElementById(zoneId);
  if (z) z.classList.add("zone-hover");
}

function checkZoneHover(cx, cy) {
  const wrap = document.getElementById(`lv${currentLevel}wrap`);
  wrap.querySelectorAll(".zone:not(.zone-correct):not(.zone-wrong)").forEach(z => {
    const r = z.getBoundingClientRect();
    if (cx >= r.left && cx <= r.right && cy >= r.top && cy <= r.bottom) {
      z.classList.add("zone-hover");
    } else {
      if (!z.id.startsWith("z") || z.dataset.correct !== dragPiece?.zone) {
        z.classList.remove("zone-hover");
      }
    }
  });
}

function clearZoneHighlights() {
  document.querySelectorAll(".zone-hover").forEach(z => z.classList.remove("zone-hover"));
}

// ═══════════════════════════════════════════════════════
// DROP LOGIC
// ═══════════════════════════════════════════════════════
function tryDrop(cx, cy) {
  const wrap = document.getElementById(`lv${currentLevel}wrap`);
  const allZones = wrap.querySelectorAll(".zone:not(.zone-correct)");

  let landedZone = null;
  allZones.forEach(z => {
    const r = z.getBoundingClientRect();
    if (cx >= r.left && cx <= r.right && cy >= r.top && cy <= r.bottom) {
      landedZone = z;
    }
  });

  if (!landedZone) {
    // Dropped outside any zone
    setStrip("warn", "❌ Drop it onto a dashed zone on the screen!");
    breakCombo();
    return;
  }

  const isDecoy   = landedZone.classList.contains("decoy");
  const isCorrect = landedZone.id === dragPiece.zone;

  if (isDecoy || !isCorrect) {
    // Wrong zone — penalty
    landedZone.classList.add("zone-wrong");
    setTimeout(() => landedZone.classList.remove("zone-wrong"), 600);
    totalScore = Math.max(0, totalScore - 5);
    updateScoreDisplay();
    setStrip("warn", "❌ Wrong zone! −5 pts. Think about UX hierarchy.");
    breakCombo();
    return;
  }

  // CORRECT DROP ✓
  placeOnDevice(dragPiece.id, dragPiece.zone);
  landedZone.classList.add("zone-correct");

  // Score: base 25 + time bonus + combo multiplier
  const timeBonus  = Math.floor(timeLeft / 6);
  const comboMult  = Math.max(1, Math.floor(combo / 2));
  const gained     = (25 + timeBonus) * comboMult;
  totalScore      += gained;
  levelScores[currentLevel] = (levelScores[currentLevel] || 0) + gained;
  updateScoreDisplay();

  // Combo
  combo++;
  updateCombo(combo, gained);

  // Tray card done
  const card = document.getElementById(`tray_${dragPiece.id}`);
  if (card) card.classList.add("tray-placed");

  // Progress
  placedCount++;
  tpPlaced.innerText = placedCount;
  tpFill.style.width = `${(placedCount / totalPieces) * 100}%`;

  const feedbacks = [
    "✅ Perfect placement!",
    "👏 That's the right spot!",
    "🎯 Nailed it!",
    "💡 Strong UX instinct!",
    "✨ Cleaner hierarchy!",
    "📱 Users will love this flow!",
  ];
  setStrip("good", feedbacks[Math.floor(Math.random() * feedbacks.length)] + (comboMult > 1 ? ` ×${comboMult} combo!` : ""));
}

// ═══════════════════════════════════════════════════════
// RENDER PIECE ONTO DEVICE
// ═══════════════════════════════════════════════════════
function placeOnDevice(pieceId, zoneId) {
  const screen = getScreenEl(currentLevel);
  const zoneEl = document.getElementById(zoneId);
  if (!screen || !zoneEl) return;

  // Build the piece HTML
  const html = getPieceHTML(pieceId);
  const div  = document.createElement("div");
  div.innerHTML = html;
  const piece = div.firstElementChild;
  piece.classList.add("piece", "placed", "snap-in");

  // Position using getBoundingClientRect
  const pr = screen.getBoundingClientRect();
  const zr = zoneEl.getBoundingClientRect();
  piece.style.position = "absolute";
  piece.style.left     = (zr.left - pr.left) + "px";
  piece.style.top      = (zr.top  - pr.top)  + "px";
  piece.style.width    = zr.width  + "px";
  piece.style.height   = zr.height + "px";
  piece.style.zIndex   = "5";

  screen.appendChild(piece);

  // Remove snap class after
  setTimeout(() => piece.classList.remove("snap-in"), 300);
}

function getScreenEl(level) {
  return document.getElementById(`lv${level}screen`);
}

function getPieceHTML(id) {
  switch(id) {
    case "p1logo":     return `<div class="logo-piece"><div class="spotify-logo"><span class="sp-icon">🎵</span><span class="sp-name">Spotify</span></div></div>`;
    case "p1email":    return `<div class="field-piece"><div class="field-inner"><span class="field-icon">✉</span><input type="text" placeholder="Email or username" readonly /></div></div>`;
    case "p1password": return `<div class="field-piece"><div class="field-inner"><span class="field-icon">🔒</span><input type="password" placeholder="Password" readonly /></div></div>`;
    case "p1btn":      return `<div class="cta-piece"><button class="fake-btn-green">LOG IN</button></div>`;
    case "p1forgot":   return `<div class="link-piece"><span class="forgot-link">Forgot your password?</span></div>`;

    case "p2summary":  return `<div class="pay-summary-piece"><div class="summary-inner"><div class="summary-title">🛒 Order Summary</div><div class="summary-row"><span>Pro Plan × 1</span><span>$199</span></div><div class="summary-row"><span>Tax</span><span>$18</span></div><div class="summary-total"><span>Total</span><span>$217</span></div></div></div>`;
    case "p2card":     return `<div class="pay-card-piece"><div class="card-inner"><div class="card-title">💳 Payment Details</div><div class="card-field">4242 4242 4242 4242</div><div class="card-row"><span>MM / YY</span><span>CVV</span></div></div></div>`;
    case "p2promo":    return `<div class="promo-piece"><div class="promo-inner"><input type="text" placeholder="🎁 Promo code" readonly /></div></div>`;
    case "p2pay":      return `<div class="paybtn-piece"><button class="fake-btn-stripe">Pay $217.00 →</button></div>`;

    case "p3sidebar":  return `<div class="sidebar-piece"><div class="sidebar-inner"><div class="sidebar-brand">⚡ Dash</div><div class="nav-item active">📊 Overview</div><div class="nav-item">👤 Users</div><div class="nav-item">💰 Revenue</div><div class="nav-item">⚙️ Settings</div><div class="nav-item">🔔 Alerts</div></div></div>`;
    case "p3profile":  return `<div class="profile-piece"><div class="profile-inner"><div class="avatar">SJ</div><div class="profile-info"><div class="profile-name">Sarah Johnson</div><div class="profile-role">Product Designer · Acme Corp</div></div><div class="profile-badge">Admin</div></div></div>`;
    case "p3stats":    return `<div class="stat-piece"><div class="stat-inner blue-stat"><div class="stat-label">📈 Sessions</div><div class="stat-value">12,480</div><div class="stat-delta up">↑ 14% this week</div></div></div>`;
    case "p3revenue":  return `<div class="stat-piece"><div class="stat-inner green-stat"><div class="stat-label">💰 Revenue</div><div class="stat-value">$84.2k</div><div class="stat-delta up">↑ 8% this month</div></div></div>`;
    case "p3save":     return `<div class="save-piece"><button class="fake-btn-dash">Save Changes ✓</button></div>`;
    default: return `<div></div>`;
  }
}

// ═══════════════════════════════════════════════════════
// COMBO
// ═══════════════════════════════════════════════════════
let comboPopTimeout = null;

function updateCombo(c, pts) {
  if (c >= 2) {
    const mult = Math.max(1, Math.floor(c / 2));
    comboWrap.classList.remove("hide");
    comboBadge.innerText = `🔥 ×${mult} combo`;
    // Pop animation
    showComboPop(`🔥 ${c}x Streak! +${pts}pts`);
  }
}

function showComboPop(text) {
  if (comboPopTimeout) clearTimeout(comboPopTimeout);
  comboPop.innerText = text;
  comboPop.classList.remove("hide");
  comboPop.style.animation = "none";
  void comboPop.offsetWidth;
  comboPop.style.animation = "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards";
  comboPopTimeout = setTimeout(() => comboPop.classList.add("hide"), 1800);
}

function breakCombo() {
  combo = 0;
  hideCombo();
}

function hideCombo() {
  comboWrap.classList.add("hide");
}

// ═══════════════════════════════════════════════════════
// SCORE DISPLAY
// ═══════════════════════════════════════════════════════
function updateScoreDisplay() {
  tbScore.innerText = totalScore;
  tbScore.classList.add("pop");
  setTimeout(() => tbScore.classList.remove("pop"), 200);
}

// ═══════════════════════════════════════════════════════
// STRIP HELPER
// ═══════════════════════════════════════════════════════
function setStrip(type, msg) {
  strip.className = `strip-${type}`;
  stripText.innerText = msg;
}

// ═══════════════════════════════════════════════════════
// SUBMIT
// ═══════════════════════════════════════════════════════
document.getElementById("btnSubmit").onclick = () => {
  clearInterval(timerInterval);

  if (placedCount < totalPieces) {
    const missing = totalPieces - placedCount;
    setStrip("warn", `❌ ${missing} element${missing > 1 ? "s" : ""} still need placing!`);
    // Restart timer if not out of time
    if (timeLeft > 0) {
      startTimer(currentLevel);
      return;
    }
  }

  // Level complete — time bonus
  const timeBonus = timeLeft * 3;
  totalScore += timeBonus;
  levelScores[currentLevel] = (levelScores[currentLevel] || 0) + timeBonus;
  updateScoreDisplay();

  setStrip("great", `🏆 Level ${currentLevel} Complete! +${timeBonus}pts time bonus`);
  document.getElementById("btnNext").classList.remove("hide");
  document.getElementById("btnSubmit").disabled = true;
};

// ═══════════════════════════════════════════════════════
// NEXT LEVEL
// ═══════════════════════════════════════════════════════
document.getElementById("btnNext").onclick = () => {
  document.getElementById("btnNext").classList.add("hide");
  clearInterval(timerInterval);

  // Mark pill done
  const pill = document.getElementById(`pill${currentLevel}`);
  if (pill) { pill.className = "tb-pill done"; }

  currentLevel++;

  if (currentLevel <= 3) {
    gameScreen.style.display  = "none";
    teachScreen.style.display = "flex";
    openTeachScreen(currentLevel);
  } else {
    openFinalScreen();
  }
};

// ═══════════════════════════════════════════════════════
// HINT (costs 15 pts)
// ═══════════════════════════════════════════════════════
document.getElementById("btnHint").onclick = () => {
  totalScore = Math.max(0, totalScore - 15);
  updateScoreDisplay();

  // Find first unplaced piece and give a vague hint about it
  const L = lessons[currentLevel];
  const remaining = L.pieces.filter(p => {
    const card = document.getElementById(`tray_${p.id}`);
    return card && !card.classList.contains("tray-placed");
  });

  if (remaining.length > 0) {
    const r = remaining[Math.floor(Math.random() * remaining.length)];
    const vague = {
      p1logo:     "The brand mark goes at the very top — it's the first thing users see.",
      p1email:    "Email input belongs above password — that's the standard order.",
      p1password: "Password follows email, both stacked in the center.",
      p1btn:      "The primary action goes right after the fields — make it unmissable.",
      p1forgot:   "The forgot link is secondary — it goes below the CTA.",
      p2summary:  "Order summary should be on the left — users verify before paying.",
      p2card:     "Card details belong on the right, opposite the summary.",
      p2promo:    "Promo code is a secondary action — bottom left, understated.",
      p2pay:      "The pay button is the hero — center bottom, full width.",
      p3sidebar:  "Navigation always lives on the far left edge.",
      p3profile:  "The user profile sits in the top content area — always accessible.",
      p3stats:    "Key metrics go in the upper content area, left column.",
      p3revenue:  "Secondary metric goes next to sessions — same row, right column.",
      p3save:     "The save button goes bottom right — primary action, not buried.",
    };
    setStrip("neutral", `💡 ${vague[r.id] || UX_HINTS[Math.floor(Math.random() * UX_HINTS.length)]}`);
  } else {
    setStrip("neutral", `💡 ${UX_HINTS[Math.floor(Math.random() * UX_HINTS.length)]}`);
  }
  breakCombo();
};

// ═══════════════════════════════════════════════════════
// RESET
// ═══════════════════════════════════════════════════════
document.getElementById("btnReset").onclick = () => { location.reload(); };

// ═══════════════════════════════════════════════════════
// FINAL SCREEN
// ═══════════════════════════════════════════════════════
function openFinalScreen() {
  clearInterval(timerInterval);
  gameScreen.style.display  = "none";
  finalScreen.style.display = "flex";

  document.getElementById("fScoreNum").innerText = totalScore;

  let grade = "D";
  if      (totalScore >= 350) grade = "S";
  else if (totalScore >= 280) grade = "A+";
  else if (totalScore >= 220) grade = "A";
  else if (totalScore >= 160) grade = "B";
  else if (totalScore >= 100) grade = "C";

  const gradeEmoji = { S: "🌟", "A+": "🏆", A: "🥇", B: "🥈", C: "🥉", D: "💪" };
  document.getElementById("fGrade").innerText = grade;
  document.getElementById("f-trophy") && (document.querySelector(".f-trophy").innerText = gradeEmoji[grade] || "🏆");

  // Breakdown
  const bd = document.getElementById("fBreakdown");
  bd.innerHTML = "";
  ["1","2","3"].forEach(n => {
    const row = document.createElement("div");
    row.className = "f-row";
    row.innerHTML = `<span class="f-row-label">Level ${n}</span><span class="f-row-val">${levelScores[n] || 0} pts</span>`;
    bd.appendChild(row);
  });

  // Confetti
  launchConfetti();
}

function launchConfetti() {
  const container = document.getElementById("confettiContainer");
  const colors = ["#7C3AED","#EC4899","#F97316","#10B981","#0EA5E9","#EAB308","#A3E635"];
  for (let i = 0; i < 80; i++) {
    const p = document.createElement("div");
    p.className = "confetti-piece";
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      width: ${6 + Math.random() * 8}px;
      height: ${6 + Math.random() * 8}px;
      border-radius: ${Math.random() > 0.5 ? "50%" : "2px"};
      animation-duration: ${1.5 + Math.random() * 2}s;
      animation-delay: ${Math.random() * 0.8}s;
    `;
    container.appendChild(p);
  }
  setTimeout(() => { container.innerHTML = ""; }, 4000);
}

// ═══════════════════════════════════════════════════════
// REPLAY
// ═══════════════════════════════════════════════════════
document.getElementById("btnReplay").onclick = () => { location.reload(); };