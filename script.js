// ═══════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════
let currentLevel  = 1;
let totalScore    = 0;
let levelScores   = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
let combo         = 0;
let timerInterval = null;
let timeLeft      = 60;
let placedCount   = 0;
let totalPieces   = 0;

// ═══════════════════════════════════════════════════════
// LESSONS
// ═══════════════════════════════════════════════════════
const LEVEL_TIME = { 1: 60, 2: 55, 3: 50, 4: 50, 5: 45 };

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
  4: {
    title:    "Email Composer UX",
    subtitle: "A broken compose form loses messages and users.",
    caption:  "Email composition needs a clear recipient field at the top, subject below, body area in the middle, and send action bottom-right. Attachments are secondary.",
    good: [ "To: field always first — set destination before content", "Subject is concise context, above body", "Body text area is the largest zone", "Send is prominent, bottom-right — natural end of flow", "Attach is secondary — bottom-left, out of primary path" ],
    bad:  [ "Missing To: field causes misdirected emails", "No subject zone confuses recipients", "Body buried below actions = reversed flow", "Send button hidden or tiny loses messages", "Attachment competing with send = accidental clicks" ],
    image: "bg.jpg",
    pieces: [
      { id: "p4to",      label: "To: Recipient Field", icon: "👤", zone: "z4to"      },
      { id: "p4subject", label: "Subject Line",         icon: "📝", zone: "z4subject" },
      { id: "p4body",    label: "Message Body",         icon: "💬", zone: "z4body"    },
      { id: "p4send",    label: "Send Button",          icon: "📤", zone: "z4send"    },
      { id: "p4attach",  label: "Attach File",          icon: "📎", zone: "z4attach"  },
    ],
  },
  5: {
    title:    "Profile Settings UX",
    subtitle: "Settings pages must be safe, clear, and recoverable.",
    caption:  "Profile editing needs avatar top-left, name and bio at the top, save button bottom-right for easy reach, and danger zone bottom-left — visible but not accidental.",
    good: [ "Avatar anchors identity at top-left", "Name is the most prominent editable field", "Bio sits under name — natural reading order", "Save is bottom-right — the expected CTA position", "Danger zone is isolated bottom-left — visible but separated" ],
    bad:  [ "Avatar buried makes it hard to update identity", "Name hidden below bio breaks hierarchy", "Save button missing = unsaved changes frustration", "Danger zone next to save = accidental deletions", "Decoy zones in middle confuse editable regions" ],
    image: "Dashboard.jpg",
    pieces: [
      { id: "p5avatar",  label: "Avatar / Photo",     icon: "🖼️", zone: "z5avatar"  },
      { id: "p5name",    label: "Display Name Field",  icon: "✏️", zone: "z5name"    },
      { id: "p5bio",     label: "Bio Text Field",      icon: "📋", zone: "z5bio"     },
      { id: "p5danger",  label: "Danger Zone",         icon: "🚨", zone: "z5danger"  },
      { id: "p5save",    label: "Save Profile",        icon: "💾", zone: "z5save"    },
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

  document.getElementById("teachTag").innerText      = `Level ${level} of 5`;
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
  for (let i = 1; i <= 5; i++) {
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
    color:var(--text); box-shadow: 0 12px 32px rgba(124,58,237,0.35), 0 0 0 4px rgba(124,58,237,0.1);
    display:flex; align-items:center; gap:8px;
    white-space:nowrap; opacity:0.97;
    transform:scale(1.08) rotate(-2deg);
    transition: transform 0.1s ease;
    animation: floatPickup 0.2s cubic-bezier(0.34,1.56,0.64,1) forwards;
  `;

  const L = lessons[currentLevel];
  const meta = L.pieces.find(p => p.id === pieceId);
  if (meta) {
    el.innerHTML = `<span style="font-size:18px">${meta.icon}</span><span>${meta.label}</span>`;
  }

  // Add a drag trail shimmer
  el.dataset.tilt = "0";
  document.body.appendChild(el);
  return el;
}

let lastDragX = 0;
let tiltTimeout = null;

function positionFloat(x, y) {
  if (!floatEl) return;
  floatEl.style.left = (x - dragOffX) + "px";
  floatEl.style.top  = (y - dragOffY) + "px";

  // Dynamic tilt based on horizontal movement
  const dx = x - lastDragX;
  lastDragX = x;
  const tilt = Math.max(-14, Math.min(14, dx * 1.2));
  floatEl.style.transform = `scale(1.08) rotate(${tilt}deg)`;

  // Spawn motion trail particle
  if (Math.abs(dx) > 2) spawnTrail(x - dragOffX, y - dragOffY);
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

  // Score burst particle at drop point
  const zr = landedZone.getBoundingClientRect();
  spawnScoreBurst(gained, zr.left + zr.width / 2 - 20, zr.top + zr.height / 2);

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

    case "p4to":       return `<div class="field-piece full"><div class="field-inner"><span class="field-icon">👤</span><input type="text" placeholder="To: recipient@email.com" readonly /></div></div>`;
    case "p4subject":  return `<div class="field-piece full"><div class="field-inner"><span class="field-icon">📝</span><input type="text" placeholder="Subject: Enter subject line…" readonly /></div></div>`;
    case "p4body":     return `<div class="email-body-piece"><textarea placeholder="Write your message here…" readonly></textarea></div>`;
    case "p4send":     return `<div class="send-piece"><button class="fake-btn-send">Send ✈</button></div>`;
    case "p4attach":   return `<div class="attach-piece"><button class="fake-btn-attach">📎 Attach</button></div>`;

    case "p5avatar":   return `<div class="avatar-piece"><div class="avatar-circle"><span>👤</span></div><div class="avatar-label">Change Photo</div></div>`;
    case "p5name":     return `<div class="field-piece full"><div class="field-inner"><span class="field-icon">✏️</span><input type="text" placeholder="Display Name" readonly /></div></div>`;
    case "p5bio":      return `<div class="field-piece full"><div class="field-inner"><span class="field-icon">📋</span><input type="text" placeholder="Short bio…" readonly /></div></div>`;
    case "p5danger":   return `<div class="danger-piece"><button class="fake-btn-danger">🚨 Delete Account</button></div>`;
    case "p5save":     return `<div class="profile-save-piece"><button class="fake-btn-dash">Save Profile ✓</button></div>`;
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

  if (currentLevel <= 5) {
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
      p4to:       "The To: field is always first — you need a destination before content.",
      p4subject:  "Subject line comes after To: — above the body, below recipient.",
      p4body:     "The message body is the largest zone, sitting below subject.",
      p4send:     "Send is bottom-right — the natural end point of the compose flow.",
      p4attach:   "Attach file is a secondary action — bottom-left, out of the main flow.",
      p5avatar:   "The avatar anchors the user's identity — top-left of the form.",
      p5name:     "Display name is the primary field — top of the form, wide.",
      p5bio:      "Bio goes just under the name — same column, secondary detail.",
      p5danger:   "Danger zone goes bottom-left — visible but isolated from the save button.",
      p5save:     "Save profile is always bottom-right — the expected CTA position.",
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
  ["1","2","3","4","5"].forEach(n => {
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
// DRAG TRAIL PARTICLES
// ═══════════════════════════════════════════════════════
let trailThrottle = 0;
function spawnTrail(x, y) {
  const now = Date.now();
  if (now - trailThrottle < 40) return; // throttle
  trailThrottle = now;

  const p = document.createElement("div");
  p.style.cssText = `
    position:fixed; pointer-events:none; z-index:9998;
    left:${x + 20 + Math.random()*16 - 8}px;
    top:${y + 12 + Math.random()*16 - 8}px;
    width:8px; height:8px; border-radius:50%;
    background:rgba(124,58,237,0.55);
    animation: trailFade 0.4s ease forwards;
  `;
  document.body.appendChild(p);
  setTimeout(() => p.remove(), 420);
}

// ═══════════════════════════════════════════════════════
// WEBGL WATER RIPPLE — INTRO SCREEN (matches gentlerain)
// Ping-pong wave simulation + normal-map refraction
// ═══════════════════════════════════════════════════════
(function initWaterRipple() {
  const canvas = document.getElementById("waveCanvas");
  if (!canvas) return;
  const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  if (!gl) return;

  let W, H;
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    gl.viewport(0, 0, W, H);
  }
  resize();
  window.addEventListener("resize", resize);

  function mkShader(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  }
  function mkProg(v, f) {
    const p = gl.createProgram();
    gl.attachShader(p, mkShader(gl.VERTEX_SHADER, v));
    gl.attachShader(p, mkShader(gl.FRAGMENT_SHADER, f));
    gl.linkProgram(p);
    return p;
  }

  const VERT = `attribute vec2 a;varying vec2 v;void main(){v=a*.5+.5;gl_Position=vec4(a,0,1);}`;

  // Wave simulation: 2D shallow water propagation
  const SIM = `
    precision highp float;
    uniform sampler2D uP,uC;
    uniform vec2 uR;
    uniform vec2 uD;
    uniform float uS;
    varying vec2 v;
    void main(){
      vec2 p=1./uR;
      float c=texture2D(uC,v).r;
      float pr=texture2D(uP,v).r;
      float n=texture2D(uC,v+vec2(0,p.y)).r;
      float s=texture2D(uC,v-vec2(0,p.y)).r;
      float e=texture2D(uC,v+vec2(p.x,0)).r;
      float w=texture2D(uC,v-vec2(p.x,0)).r;
      float nx=(n+s+e+w)*.5-pr;
      nx*=.984;
      float d=distance(v,uD);
      nx+=uS*exp(-d*d*700.);
      gl_FragColor=vec4(clamp(nx,-1.,1.),0,0,1);
    }
  `;

  // Render: use wave height as normal map distortion over dark gradient
  const RENDER = `
    precision highp float;
    uniform sampler2D uH;
    uniform vec2 uR;
    varying vec2 v;
    void main(){
      vec2 p=1./uR;
      float hL=texture2D(uH,v-vec2(p.x,0)).r;
      float hR=texture2D(uH,v+vec2(p.x,0)).r;
      float hD=texture2D(uH,v-vec2(0,p.y)).r;
      float hU=texture2D(uH,v+vec2(0,p.y)).r;
      vec2 norm=vec2(hL-hR,hD-hU)*0.016;
      vec2 uv=v+norm;
      // dark gradient base with violet/pink blobs (original palette)
      float r1=length(uv-vec2(.82,.18));
      float r2=length(uv-vec2(.12,.85));
      float r3=length(uv-vec2(.5,.5));
      vec3 dark=vec3(.047,.040,.065);
      vec3 viol=vec3(.486,.227,.929);
      vec3 pink=vec3(.929,.282,.600);
      vec3 sky =vec3(.055,.647,.918);
      vec3 col=dark+viol*exp(-r1*r1*2.8)*.22+pink*exp(-r2*r2*3.2)*.16+sky*exp(-r3*r3*5.0)*.08;
      // crest shimmer — cool highlight on wave peaks
      float h=texture2D(uH,v).r;
      col+=vec3(.85,.72,1.0)*max(h,0.)*.24;
      // vignette
      float vig=1.-smoothstep(.38,1.1,length(v-.5)*1.5);
      col=col*vig*.3+col*.7;
      gl_FragColor=vec4(col,1);
    }
  `;

  const simProg = mkProg(VERT, SIM);
  const renProg = mkProg(VERT, RENDER);

  // Fullscreen quad
  const qbuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, qbuf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);

  function bindQ(prog) {
    const loc = gl.getAttribLocation(prog, "a");
    gl.bindBuffer(gl.ARRAY_BUFFER, qbuf);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  }

  function mkTex() {
    const t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, W, H, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return t;
  }
  function mkFBO(tex) {
    const fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    return fb;
  }

  let tA = mkTex(), tB = mkTex(), tC = mkTex();
  let fA = mkFBO(tA), fB = mkFBO(tB), fC = mkFBO(tC);

  const intro = document.getElementById("introScreen");
  const drops = [];

  // Mouse movement → drops proportional to speed
  let lx = -1, ly = -1;
  intro.addEventListener("mousemove", e => {
    const nx = e.clientX / W, ny = 1.0 - e.clientY / H;
    const spd = Math.hypot(nx - lx, ny - ly);
    if (spd > 0.003) drops.push({ x: nx, y: ny, s: Math.min(spd * 3.5, 0.55) });
    lx = nx; ly = ny;
  });
  intro.addEventListener("mousedown", e => {
    drops.push({ x: e.clientX / W, y: 1.0 - e.clientY / H, s: 1.3 });
  });

  // Gentle ambient rain drops
  setInterval(() => {
    if (Math.random() < 0.45) drops.push({ x: Math.random(), y: Math.random(), s: 0.07 + Math.random() * 0.13 });
  }, 260);

  let rafId;
  function frame() {
    // Simulation step
    gl.useProgram(simProg);
    bindQ(simProg);
    const drop = drops.shift() || { x: -1, y: -1, s: 0 };
    gl.uniform2f(gl.getUniformLocation(simProg,"uR"), W, H);
    gl.uniform2f(gl.getUniformLocation(simProg,"uD"), drop.x, drop.y);
    gl.uniform1f(gl.getUniformLocation(simProg,"uS"), drop.s);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tA);
    gl.uniform1i(gl.getUniformLocation(simProg,"uP"), 0);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, tB);
    gl.uniform1i(gl.getUniformLocation(simProg,"uC"), 1);
    gl.bindFramebuffer(gl.FRAMEBUFFER, fC);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    // Rotate buffers
    let tmp;
    tmp=tA;tA=tB;tB=tC;tC=tmp;
    tmp=fA;fA=fB;fB=fC;fC=tmp;

    // Render
    gl.useProgram(renProg);
    bindQ(renProg);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tB);
    gl.uniform1i(gl.getUniformLocation(renProg,"uH"), 0);
    gl.uniform2f(gl.getUniformLocation(renProg,"uR"), W, H);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    rafId = requestAnimationFrame(frame);
  }
  frame();

  const obs = new MutationObserver(() => {
    if (intro.style.display === "none") { cancelAnimationFrame(rafId); obs.disconnect(); }
  });
  obs.observe(intro, { attributes: true, attributeFilter: ["style"] });
})();

// ═══════════════════════════════════════════════════════
// AWWWARDS EFFECT 1 — CUSTOM MAGNETIC CURSOR
// Smooth laggy dot + ring, morphs on hover/drag
// ═══════════════════════════════════════════════════════
(function initCursor() {
  const dot  = document.createElement("div"); dot.id  = "gr-cursor";
  const ring = document.createElement("div"); ring.id = "gr-cursor-ring";
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mx = -200, my = -200; // raw mouse
  let rx = -200, ry = -200; // ring position (lerped)
  let rafId;

  document.addEventListener("mousemove", e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + "px";
    dot.style.top  = my + "px";
  });

  // Laggy ring follows with lerp
  function tickRing() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.left = rx + "px";
    ring.style.top  = ry + "px";
    rafId = requestAnimationFrame(tickRing);
  }
  tickRing();

  // Hover state on interactive elements
  const HOVER_SEL = "button, .btn-primary, .btn-sec, .btn-success, .tray-piece, .chip, .tb-pill, a";
  document.addEventListener("mouseover", e => {
    if (e.target.closest(HOVER_SEL)) {
      dot.classList.add("cursor-hover");
      ring.classList.add("cursor-hover");
    }
  });
  document.addEventListener("mouseout", e => {
    if (e.target.closest(HOVER_SEL)) {
      dot.classList.remove("cursor-hover");
      ring.classList.remove("cursor-hover");
    }
  });

  // Click pulse
  document.addEventListener("mousedown", () => {
    dot.classList.add("cursor-click");
    ring.style.transform = "translate(-50%,-50%) scale(0.85)";
  });
  document.addEventListener("mouseup", () => {
    dot.classList.remove("cursor-click");
    ring.style.transform = "";
  });

  // Drag state
  document.addEventListener("dragstart-custom", () => {
    dot.classList.add("cursor-drag"); ring.classList.add("cursor-drag");
  });
  document.addEventListener("dragend-custom", () => {
    dot.classList.remove("cursor-drag"); ring.classList.remove("cursor-drag");
  });
})();

// Signal drag state to cursor
const _origStartDrag = startTrayDrag;
// patch drag start/end via event
document.addEventListener("mousedown", e => {
  if (e.target.closest(".tray-piece")) {
    setTimeout(() => document.dispatchEvent(new Event("dragstart-custom")), 10);
  }
});
document.addEventListener("mouseup", () => {
  document.dispatchEvent(new Event("dragend-custom"));
});

// ═══════════════════════════════════════════════════════
// AWWWARDS EFFECT 2 — INK RIPPLE ON BUTTONS
// Click spawns a circular ink ripple that expands across the button
// ═══════════════════════════════════════════════════════
(function initButtonRipple() {
  function spawnRipple(e) {
    const btn = e.currentTarget;
    const r   = btn.getBoundingClientRect();
    const x   = e.clientX - r.left;
    const y   = e.clientY - r.top;
    const maxR = Math.max(r.width, r.height) * 1.6;

    const ink = document.createElement("span");
    ink.style.cssText = `
      position:absolute; border-radius:50%; pointer-events:none;
      left:${x}px; top:${y}px;
      width:0; height:0;
      transform:translate(-50%,-50%);
      background:rgba(255,255,255,0.22);
      animation: inkExpand 0.55s cubic-bezier(0.22,1,0.36,1) forwards;
    `;
    btn.style.position = "relative";
    btn.style.overflow = "hidden";
    btn.appendChild(ink);

    // Expand to full size
    requestAnimationFrame(() => {
      ink.style.width  = maxR * 2 + "px";
      ink.style.height = maxR * 2 + "px";
    });
    setTimeout(() => ink.remove(), 560);
  }

  function attachAll() {
    document.querySelectorAll(".btn-primary, .btn-success, .btn-sec").forEach(btn => {
      if (btn.dataset.rippleAttached) return;
      btn.dataset.rippleAttached = "1";
      btn.addEventListener("mousedown", spawnRipple);
    });
  }
  attachAll();
  const obs = new MutationObserver(attachAll);
  obs.observe(document.body, { childList: true, subtree: true });
})();


// ═══════════════════════════════════════════════════════
// EFFECT 2b — SMOOTH SHIMMER SWEEP on button hover
// A soft light gleam slides across the button on hover.
// Clean, luxurious, no text changes.
// ═══════════════════════════════════════════════════════
(function initButtonShimmer() {
  function attachAll() {
    document.querySelectorAll(".btn-primary, .btn-success, .btn-sec").forEach(btn => {
      if (btn.dataset.shimmerAttached) return;
      btn.dataset.shimmerAttached = "1";

      // Build shimmer span once
      const shim = document.createElement("span");
      shim.className = "btn-shimmer";
      btn.appendChild(shim);
    });
  }
  attachAll();
  const obs = new MutationObserver(attachAll);
  obs.observe(document.body, { childList: true, subtree: true });
})();


// ═══════════════════════════════════════════════════════
// AWWWARDS EFFECT 3 — SCORE BURST PARTICLES
// +N floats up from the score on correct drop
// ═══════════════════════════════════════════════════════
function spawnScoreBurst(pts, x, y) {
  const el = document.createElement("div");
  el.className = "score-burst";
  el.innerText = `+${pts}`;
  el.style.left = x + "px";
  el.style.top  = y + "px";
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 800);
}

// ═══════════════════════════════════════════════════════
// AWWWARDS EFFECT 4 — SCREEN SLIDE TRANSITIONS
// Screens fade+slide up when revealed
// ═══════════════════════════════════════════════════════
(function patchScreenTransitions() {
  // Patch show calls to add the animation class
  const screens = ["introScreen","teachScreen","gameScreen","finalScreen"];
  screens.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const obs = new MutationObserver(() => {
      const vis = el.style.display && el.style.display !== "none";
      if (vis) {
        el.classList.remove("screen-enter");
        void el.offsetWidth; // reflow
        el.classList.add("screen-enter");
      }
    });
    obs.observe(el, { attributes: true, attributeFilter: ["style"] });
  });
})();

// ═══════════════════════════════════════════════════════
// AWWWARDS EFFECT 5 — CURSOR SPOTLIGHT on game canvas
// A soft radial glow follows the mouse over the device area,
// making zones subtly illuminate as you approach them
// ═══════════════════════════════════════════════════════
(function initSpotlight() {
  const canvasCol = document.getElementById("canvasCol");
  if (!canvasCol) return;

  // Create the spotlight element
  const spot = document.createElement("div");
  spot.id = "canvasSpotlight";
  spot.style.cssText = `
    position:absolute; pointer-events:none; z-index:1;
    width:340px; height:340px; border-radius:50%;
    background: radial-gradient(circle, rgba(124,58,237,0.09) 0%, rgba(236,72,153,0.04) 45%, transparent 70%);
    transform:translate(-50%,-50%);
    transition: opacity 0.3s ease;
    opacity:0;
    mix-blend-mode: screen;
  `;
  canvasCol.style.position = "relative";
  canvasCol.appendChild(spot);

  canvasCol.addEventListener("mouseenter", () => { spot.style.opacity = "1"; });
  canvasCol.addEventListener("mouseleave", () => { spot.style.opacity = "0"; });
  canvasCol.addEventListener("mousemove", e => {
    const r = canvasCol.getBoundingClientRect();
    spot.style.left = (e.clientX - r.left)  + "px";
    spot.style.top  = (e.clientY - r.top) + "px";
  });
})();

// ═══════════════════════════════════════════════════════
// DEV MODE
// ═══════════════════════════════════════════════════════
let devTimerPaused  = false;
let devSlowMo       = false;
let devHintsVisible = true;

const devPanel = document.getElementById("devPanel");

// ── Open / Close ────────────────────────────────────────
document.getElementById("btnOpenDev").onclick = () => {
  devPanel.classList.remove("hide");
  devLog("Dev panel opened", "info");
};
document.getElementById("btnCloseDev").onclick = () => {
  devPanel.classList.add("hide");
};

// ── Log helper ──────────────────────────────────────────
function devLog(msg, type = "") {
  const log = document.getElementById("devLog");
  if (!log) return;
  const entry = document.createElement("div");
  entry.className = "dev-log-entry" + (type ? " " + type : "");
  const time = new Date().toLocaleTimeString("en-GB", { hour12: false });
  entry.textContent = `[${time}] ${msg}`;
  log.prepend(entry);
  while (log.children.length > 60) log.lastElementChild.remove();
}
document.getElementById("devClearLog").onclick = () => {
  document.getElementById("devLog").innerHTML = "";
};

// ── Core nav helper — the ONE correct way to change level ──
function devGoToLevel(lv) {
  if (lv < 1 || lv > 5) { devLog(`Invalid level ${lv}`, "error"); return; }
  clearInterval(timerInterval);
  devTimerPaused = false;
  currentLevel = lv;

  // Hide all screens, show game
  introScreen.style.display  = "none";
  teachScreen.style.display  = "none";
  finalScreen.style.display  = "none";
  gameScreen.style.display   = "flex";

  // Update pills
  for (let i = 1; i <= 5; i++) {
    const pill = document.getElementById(`pill${i}`);
    if (pill) pill.className = "tb-pill" + (i < lv ? " done" : i === lv ? " active" : "");
  }

  // Reset submit/next buttons
  document.getElementById("btnNext").classList.add("hide");
  document.getElementById("btnSubmit").disabled = false;

  loadLevel(lv);
  devLog(`→ Level ${lv} loaded`, "info");
}

// ── Complete level properly (no faking clicks on hidden buttons) ──
function devCompleteLevel() {
  clearInterval(timerInterval);
  devTimerPaused = false;

  const timeBonus = timeLeft * 3;
  totalScore += timeBonus;
  levelScores[currentLevel] = (levelScores[currentLevel] || 0) + timeBonus;
  updateScoreDisplay();

  setStrip("great", `🏆 Level ${currentLevel} Complete! +${timeBonus}pts time bonus`);
  document.getElementById("btnNext").classList.remove("hide");
  document.getElementById("btnSubmit").disabled = true;
}

// ── TIMER ────────────────────────────────────────────────
document.getElementById("devPauseTimer").onclick = () => {
  if (!devTimerPaused) {
    clearInterval(timerInterval);
    devTimerPaused = true;
    document.getElementById("devPauseTimer").textContent = "⏸ Paused";
    devLog("Timer paused ⏸", "warn");
  }
};
document.getElementById("devResumeTimer").onclick = () => {
  devTimerPaused = false;
  document.getElementById("devPauseTimer").textContent = "⏸ Pause Timer";
  startTimer(currentLevel);
  devLog("Timer resumed ▶", "info");
};
document.getElementById("devAdd30").onclick = () => {
  timeLeft = Math.min(timeLeft + 30, 999);
  updateTimerDisplay(timeLeft, LEVEL_TIME[currentLevel] || 60);
  devLog(`+30s → ${timeLeft}s`, "info");
};
document.getElementById("devSetTimer10").onclick = () => {
  timeLeft = 10;
  updateTimerDisplay(10, LEVEL_TIME[currentLevel] || 60);
  devLog("Timer → 10s", "warn");
};
document.getElementById("devKillTimer").onclick = () => {
  clearInterval(timerInterval);
  devTimerPaused = false;
  timeUp();
  devLog("Timer killed — time up!", "error");
};

// ── LEVELS ───────────────────────────────────────────────
document.getElementById("devSkipLevel").onclick = () => {
  const from = currentLevel;
  if (currentLevel >= 5) {
    openFinalScreen();
    devLog("Last level — jumped to final", "warn");
    return;
  }
  // Mark current pill done, advance
  const pill = document.getElementById(`pill${currentLevel}`);
  if (pill) pill.className = "tb-pill done";
  devGoToLevel(currentLevel + 1);
  devLog(`Skipped level ${from} → ${currentLevel}`, "warn");
};

document.getElementById("devPrevLevel").onclick = () => {
  if (currentLevel <= 1) { devLog("Already at level 1", "error"); return; }
  devGoToLevel(currentLevel - 1);
};

document.getElementById("devWinLevel").onclick = () => {
  devAutoPlaceAll();
  setTimeout(() => {
    devCompleteLevel();
    devLog("Level won ✅", "info");
  }, 80);
};

document.getElementById("devGoFinal").onclick = () => {
  clearInterval(timerInterval);
  devTimerPaused = false;
  openFinalScreen();
  devLog("Jumped to final 🏆", "info");
};

document.querySelectorAll(".dev-lvl").forEach(btn => {
  btn.onclick = () => {
    const lv = parseInt(btn.dataset.lv);
    devGoToLevel(lv);
  };
});

// ── SCORE ────────────────────────────────────────────────
document.getElementById("devAdd500").onclick = () => {
  totalScore += 500;
  levelScores[currentLevel] = (levelScores[currentLevel] || 0) + 500;
  updateScoreDisplay();
  devLog(`+500 → ${totalScore} pts`);
};
document.getElementById("devAdd100").onclick = () => {
  totalScore += 100;
  levelScores[currentLevel] = (levelScores[currentLevel] || 0) + 100;
  updateScoreDisplay();
  devLog(`+100 → ${totalScore} pts`);
};
document.getElementById("devZeroScore").onclick = () => {
  totalScore = 0;
  levelScores = { 1:0, 2:0, 3:0, 4:0, 5:0 };
  updateScoreDisplay();
  devLog("Score zeroed", "error");
};
document.getElementById("devMaxScore").onclick = () => {
  totalScore = 9999;
  levelScores = { 1:2000, 2:2000, 3:2000, 4:2000, 5:1999 };
  updateScoreDisplay();
  devLog("Score maxed → 9999", "info");
};

// ── PIECES ───────────────────────────────────────────────
function devAutoPlaceAll() {
  const L = lessons[currentLevel];
  if (!L) { devLog("No level loaded", "error"); return; }

  // Make sure the right device is showing (needed for getBoundingClientRect)
  document.querySelectorAll(".devWrap").forEach(el => el.classList.add("hide"));
  const wrap = document.getElementById(`lv${currentLevel}wrap`);
  if (wrap) wrap.classList.remove("hide");

  let placed = 0;
  L.pieces.forEach(p => {
    const card   = document.getElementById(`tray_${p.id}`);
    const zoneEl = document.getElementById(p.zone);
    if (!card || !zoneEl) return;
    if (card.classList.contains("tray-placed")) return;
    if (zoneEl.classList.contains("zone-correct")) return;

    placeOnDevice(p.id, p.zone);
    zoneEl.classList.add("zone-correct");
    card.classList.add("tray-placed");
    placedCount++;
    placed++;
    tpPlaced.innerText = placedCount;
    tpFill.style.width = `${(placedCount / totalPieces) * 100}%`;
  });
  devLog(`Auto-placed ${placed} piece${placed !== 1 ? "s" : ""}`, "info");
}

document.getElementById("devAutoPlace").onclick = () => devAutoPlaceAll();

document.getElementById("devResetPieces").onclick = () => {
  // Clear any placed piece elements from screen
  const screen = document.getElementById(`lv${currentLevel}screen`);
  if (screen) screen.querySelectorAll(".piece.placed").forEach(el => el.remove());
  loadLevel(currentLevel);
  devLog(`Level ${currentLevel} reset ↺`, "warn");
};

document.getElementById("devRevealZones").onclick = () => {
  document.body.classList.add("dev-zones-visible");
  devLog("Zones revealed 👁");
};
document.getElementById("devHideZones").onclick = () => {
  document.body.classList.remove("dev-zones-visible");
  devLog("Zones hidden 🙈");
};

// ── COMBO ────────────────────────────────────────────────
document.getElementById("devSetCombo5").onclick = () => {
  combo = 10;
  updateCombo(combo, 0);
  devLog("Combo → ×5", "info");
};
document.getElementById("devSetCombo10").onclick = () => {
  combo = 20;
  updateCombo(combo, 0);
  devLog("Combo → ×10", "info");
};
document.getElementById("devBreakCombo").onclick = () => {
  breakCombo();
  devLog("Combo broken", "error");
};

// ── DISPLAY ──────────────────────────────────────────────
document.getElementById("devToggleHints").onclick = () => {
  const box = document.getElementById("trayHintBox");
  if (!box) return;
  devHintsVisible = !devHintsVisible;
  box.style.display = devHintsVisible ? "" : "none";
  devLog(`Hints ${devHintsVisible ? "shown" : "hidden"}`);
};
document.getElementById("devFlashStrip").onclick = () => {
  const types = ["good","warn","great","time","neutral"];
  const msgs  = ["✅ Looking good!", "❌ Wrong zone!", "🏆 Nailed it!", "⏰ Hurry up!", "🎯 Dev test strip"];
  const idx   = Math.floor(Math.random() * types.length);
  setStrip(types[idx], msgs[idx]);
  devLog(`Strip: ${types[idx]}`, "info");
};
document.getElementById("devToggleSlow").onclick = () => {
  devSlowMo = !devSlowMo;
  document.body.classList.toggle("dev-slow", devSlowMo);
  document.getElementById("devToggleSlow").textContent = devSlowMo ? "🐇 Normal Speed" : "🐢 Slow Motion";
  devLog(`Slow motion ${devSlowMo ? "ON 🐢" : "OFF 🐇"}`, devSlowMo ? "warn" : "info");
};

// ═══════════════════════════════════════════════════════
// REPLAY
// ═══════════════════════════════════════════════════════
document.getElementById("btnReplay").onclick = () => { location.reload(); };