/**
 * UI/UX Design Rescue — script.js
 * Author: Maftuna (Developer)
 * Owns: Level 2 (Checkout) and Level 3 (Dashboard) interactions
 * Shared: game state, drag engine, scoring, feedback system
 *
 * HOW IT WORKS:
 * Each level has a set of ELEMENTS (draggable divs) and ZONES (drop targets).
 * Each element has a target zone ID. When an element is dropped close enough
 * to its correct zone, it "snaps" and scores points.
 * Score is calculated per element: correct placement = full points.
 * Progress bar fills based on total snapped / total possible.
 */

"use strict";

/* ============================================================
   GAME STATE
============================================================ */

/** Tracks score, current level, and placement results per level */
const gameState = {
  currentLevel: 1,       // 1-indexed
  totalLevels:  3,
  score:        0,
  maxScore:     0,
  levelScores:  [0, 0, 0],   // earned score per level
  levelMaxes:   [0, 0, 0],   // max possible score per level
  snappedElements: {},       // elementId -> true if correctly placed
};

/* ============================================================
   LEVEL DEFINITIONS
   Each level defines elements and their scoring values.
============================================================ */

/**
 * LEVEL 1 — Login Screen (Phone)
 * 5 elements, 20 points each = 100 pts
 */
const level1Config = {
  pointsPerElement: 20,
  elements: [
    { id: 'loginLogo',      zoneId: 'logoZone',      label: 'App Logo' },
    { id: 'emailInput',     zoneId: 'emailZone',     label: 'Email Field' },
    { id: 'passwordInput',  zoneId: 'passwordZone',  label: 'Password Field' },
    { id: 'loginBtn',       zoneId: 'loginBtnZone',  label: 'Login Button' },
    { id: 'forgotText',     zoneId: 'forgotZone',    label: 'Forgot Password' },
  ],
};

/**
 * LEVEL 2 — Checkout Screen (Tablet)
 * 4 elements, 25 points each = 100 pts
 */
const level2Config = {
  pointsPerElement: 25,
  elements: [
    { id: 'cardDetails',  zoneId: 'cardZone',      label: 'Card Details' },
    { id: 'summaryBox',   zoneId: 'summaryZone',   label: 'Order Summary' },
    { id: 'promoBox',     zoneId: 'promoZone',     label: 'Promo Code' },
    { id: 'checkoutBtn',  zoneId: 'checkoutZone',  label: 'Pay Button' },
  ],
};

/**
 * LEVEL 3 — Dashboard (Laptop)
 * 5 elements, 20 points each = 100 pts
 */
const level3Config = {
  pointsPerElement: 20,
  elements: [
    { id: 'sideBar',      zoneId: 'sideZone',     label: 'Sidebar' },
    { id: 'profileCard',  zoneId: 'profileZone',  label: 'Profile Card' },
    { id: 'statsCard',    zoneId: 'statsZone',     label: 'Analytics Card' },
    { id: 'salesCard',    zoneId: 'salesZone',     label: 'Revenue Card' },
    { id: 'saveBtn',      zoneId: 'saveZone',      label: 'Save Button' },
  ],
};

/** All level configs indexed by level number */
const levelConfigs = {
  1: level1Config,
  2: level2Config,
  3: level3Config,
};

/* ============================================================
   LIVE FEEDBACK MESSAGES
   Shown randomly when elements are moved or snapped.
============================================================ */

const feedbackMessages = {
  snap: [
    '✅ That belongs there — good eye!',
    '🎯 Perfect placement. Visual hierarchy improving.',
    '✨ Users will find that easier now.',
    '👏 Exactly right. That makes the flow cleaner.',
    '📐 Aligned. Consistency score going up.',
  ],
  move: [
    '🔍 Keep going — find where this belongs.',
    '📱 Think about what the user needs to see first.',
    '🧠 Hierarchy matters — what\'s most important?',
    '👁️ Where would your eye naturally go?',
    '🎨 Spacing creates rhythm. Keep building.',
  ],
  hint: [
    '💡 Top = most important. Bottom = secondary actions.',
    '💡 Primary buttons should be large and obvious.',
    '💡 Group related elements together.',
    '💡 The user reads top to bottom, left to right.',
    '💡 Labels above inputs, buttons below forms.',
  ],
};

/* ============================================================
   DRAG ENGINE
   Handles all mouse/touch drag interactions.
============================================================ */

/** Currently active drag state */
let drag = {
  el:         null,   // the element being dragged
  startX:     0,      // mouse X at drag start
  startY:     0,      // mouse Y at drag start
  elStartX:   0,      // element left at drag start
  elStartY:   0,      // element top at drag start
  container:  null,   // parent canvas element
};

/** Currently active resize state */
let resize = {
  el:         null,
  startX:     0,
  startY:     0,
  startW:     0,
  startH:     0,
};

/**
 * Initialises drag listeners on all .draggable elements
 * inside a given canvas element.
 * @param {HTMLElement} canvas - the level's canvas div
 */
function initDraggables(canvas) {
  const draggables = canvas.querySelectorAll('.draggable');
  draggables.forEach(el => {
    // Drag starts on mousedown on the element (not the resize handle)
    el.addEventListener('mousedown', onDragStart);

    // Resize starts on mousedown on the resize handle
    const handle = el.querySelector('.resize-handle');
    if (handle) {
      handle.addEventListener('mousedown', onResizeStart);
    }
  });
}

/**
 * Called when user presses mouse on a draggable.
 * Records start positions and attaches global move/up listeners.
 * @param {MouseEvent} e
 */
function onDragStart(e) {
  // If user clicked the resize handle, let resize handle it
  if (e.target.classList.contains('resize-handle')) return;

  e.preventDefault();

  const el = e.currentTarget;
  drag.el        = el;
  drag.container = el.parentElement;
  drag.startX    = e.clientX;
  drag.startY    = e.clientY;
  drag.elStartX  = parseInt(el.style.left)  || el.offsetLeft;
  drag.elStartY  = parseInt(el.style.top)   || el.offsetTop;

  el.classList.add('dragging');

  document.addEventListener('mousemove', onDragMove);
  document.addEventListener('mouseup',   onDragEnd);
}

/**
 * Called continuously while dragging.
 * Moves element and highlights any nearby drop zone.
 * @param {MouseEvent} e
 */
function onDragMove(e) {
  if (!drag.el) return;

  const dx = e.clientX - drag.startX;
  const dy = e.clientY - drag.startY;

  const newLeft = drag.elStartX + dx;
  const newTop  = drag.elStartY + dy;

  drag.el.style.left = newLeft + 'px';
  drag.el.style.top  = newTop  + 'px';

  // Highlight the nearest drop zone while dragging
  highlightNearestZone(drag.el);

  // Show live move feedback occasionally (1 in 12 moves)
  if (Math.random() < 0.08) {
    updateLesson(randomFrom(feedbackMessages.move));
  }
}

/**
 * Called when mouse is released after dragging.
 * Checks if the element is close enough to its correct zone to snap.
 * @param {MouseEvent} e
 */
function onDragEnd(e) {
  if (!drag.el) return;

  drag.el.classList.remove('dragging');

  // Try to snap the element to its correct drop zone
  const snapped = trySnap(drag.el);

  if (!snapped) {
    // Clear any lingering zone highlights
    clearZoneHighlights(drag.container);
  }

  // Update score display and progress bar
  updateScoreDisplay();
  updateProgressBar();

  // Clean up drag state
  drag.el = null;
  document.removeEventListener('mousemove', onDragMove);
  document.removeEventListener('mouseup',   onDragEnd);
}

/* ============================================================
   RESIZE ENGINE
============================================================ */

/**
 * Called on mousedown of a resize handle.
 * @param {MouseEvent} e
 */
function onResizeStart(e) {
  e.preventDefault();
  e.stopPropagation();

  const el = e.currentTarget.parentElement;
  resize.el     = el;
  resize.startX = e.clientX;
  resize.startY = e.clientY;
  resize.startW = el.offsetWidth;
  resize.startH = el.offsetHeight;

  document.addEventListener('mousemove', onResizeMove);
  document.addEventListener('mouseup',   onResizeEnd);
}

/**
 * Called while resizing. Updates element width and height.
 * @param {MouseEvent} e
 */
function onResizeMove(e) {
  if (!resize.el) return;

  const newW = Math.max(80,  resize.startW + (e.clientX - resize.startX));
  const newH = Math.max(32,  resize.startH + (e.clientY - resize.startY));

  resize.el.style.width  = newW + 'px';
  resize.el.style.height = newH + 'px';
}

/**
 * Called when mouse is released after resizing.
 */
function onResizeEnd() {
  resize.el = null;
  document.removeEventListener('mousemove', onResizeMove);
  document.removeEventListener('mouseup',   onResizeEnd);
  updateScoreDisplay();
}

/* ============================================================
   SNAP / DROP ZONE LOGIC
============================================================ */

/**
 * Checks if a draggable element is overlapping its correct drop zone.
 * If yes: snaps it, marks it placed, awards points.
 * @param {HTMLElement} el - the dragged element
 * @returns {boolean} true if successfully snapped
 */
function trySnap(el) {
  const config  = levelConfigs[gameState.currentLevel];
  const elConf  = config.elements.find(c => c.id === el.id);
  if (!elConf) return false;

  const zone = document.getElementById(elConf.zoneId);
  if (!zone) return false;

  if (isOverlapping(el, zone, 0.4)) {
    // Snap into position
    snapToZone(el, zone);
    zone.classList.add('filled');
    el.classList.add('snapped');
    el.classList.add('snap-anim');
    el.addEventListener('animationend', () => el.classList.remove('snap-anim'), { once: true });

    // Award points if not already scored
    if (!gameState.snappedElements[el.id]) {
      gameState.snappedElements[el.id] = true;
      gameState.score += config.pointsPerElement;
      gameState.levelScores[gameState.currentLevel - 1] += config.pointsPerElement;
      showToast('✅ ' + elConf.label + ' placed correctly!');
      updateLesson(randomFrom(feedbackMessages.snap));
    }
    return true;
  }

  return false;
}

/**
 * Teleports element to sit inside the zone exactly.
 * Uses the zone's position relative to their shared canvas.
 * @param {HTMLElement} el
 * @param {HTMLElement} zone
 */
function snapToZone(el, zone) {
  // Both el and zone are inside the same canvas, so offsetLeft/Top works
  el.style.left = zone.offsetLeft   + 'px';
  el.style.top  = zone.offsetTop    + 'px';
  el.style.width  = zone.offsetWidth  + 'px';
  el.style.height = zone.offsetHeight + 'px';
}

/**
 * Returns true if el's bounding rect overlaps zone's rect
 * by at least `threshold` fraction of the zone's area.
 * @param {HTMLElement} el
 * @param {HTMLElement} zone
 * @param {number} threshold - 0 to 1
 * @returns {boolean}
 */
function isOverlapping(el, zone, threshold) {
  const er = el.getBoundingClientRect();
  const zr = zone.getBoundingClientRect();

  const overlapX = Math.max(0, Math.min(er.right, zr.right)   - Math.max(er.left, zr.left));
  const overlapY = Math.max(0, Math.min(er.bottom, zr.bottom) - Math.max(er.top,  zr.top));
  const overlapArea  = overlapX * overlapY;
  const zoneArea     = zr.width * zr.height;

  return overlapArea / zoneArea >= threshold;
}

/**
 * Adds .hovered class to the zone nearest to the dragged element.
 * @param {HTMLElement} el
 */
function highlightNearestZone(el) {
  const config  = levelConfigs[gameState.currentLevel];
  const elConf  = config.elements.find(c => c.id === el.id);
  if (!elConf) return;

  const zone = document.getElementById(elConf.zoneId);
  if (!zone) return;

  // Clear all zone hovers first
  clearZoneHighlights(el.parentElement);

  // Highlight correct zone if close enough
  if (isOverlapping(el, zone, 0.1)) {
    zone.classList.add('hovered');
  }
}

/**
 * Removes .hovered class from all zones inside a container.
 * @param {HTMLElement} container
 */
function clearZoneHighlights(container) {
  if (!container) return;
  container.querySelectorAll('.dropZone').forEach(z => z.classList.remove('hovered'));
}

/* ============================================================
   SCORE + PROGRESS UI
============================================================ */

/**
 * Recalculates max possible score for current level and updates display.
 */
function updateScoreDisplay() {
  document.getElementById('scoreNum').textContent = gameState.score;
}

/**
 * Updates the progress bar fill based on snapped elements / total elements.
 */
function updateProgressBar() {
  const config  = levelConfigs[gameState.currentLevel];
  const total   = config.elements.length;
  const snapped = config.elements.filter(c => gameState.snappedElements[c.id]).length;
  const pct     = total > 0 ? (snapped / total) * 100 : 0;
  document.getElementById('progressFill').style.width = pct + '%';

  // Auto-show Next Level button if all placed
  if (snapped === total) {
    document.getElementById('nextBtn').classList.remove('hidden');
    document.getElementById('feedbackBar').classList.add('great');
    updateLesson('🏆 Level complete! Great eye for layout. Hit Next Level.');
  }
}

/* ============================================================
   LESSON / FEEDBACK PANEL
============================================================ */

/**
 * Updates the lesson panel text with a new message.
 * @param {string} msg
 */
function updateLesson(msg) {
  document.getElementById('lessonText').textContent = msg;
}

/**
 * Shows a floating toast notification briefly.
 * @param {string} msg
 */
function showToast(msg) {
  const toast = document.createElement('div');
  toast.className   = 'toast';
  toast.textContent = msg;
  document.body.appendChild(toast);
  toast.addEventListener('animationend', () => toast.remove());
}

/* ============================================================
   LEVEL NAVIGATION
============================================================ */

/**
 * Sets up a level: shows the correct screen, inits drag listeners,
 * records max score, updates topbar.
 * @param {number} levelNum - 1-indexed
 */
function loadLevel(levelNum) {
  gameState.currentLevel = levelNum;

  // Hide all level screens, show the target one
  document.querySelectorAll('.levelScreen').forEach(s => s.classList.remove('active'));
  const screen = document.getElementById('level' + levelNum);
  if (screen) screen.classList.add('active');

  // Determine which canvas holds the draggables
  const canvasMap = { 1: 'phoneCanvas', 2: 'tabletCanvas', 3: 'laptopCanvas' };
  const canvas = document.getElementById(canvasMap[levelNum]);
  if (canvas) initDraggables(canvas);

  // Update level label
  document.getElementById('levelNum').textContent = levelNum;

  // Record max score for this level
  const config = levelConfigs[levelNum];
  const maxPts = config.elements.length * config.pointsPerElement;
  gameState.maxScore += maxPts;
  gameState.levelMaxes[levelNum - 1] = maxPts;

  // Reset progress bar and buttons
  document.getElementById('progressFill').style.width = '0%';
  document.getElementById('nextBtn').classList.add('hidden');
  document.getElementById('feedbackBar').classList.remove('good', 'warn', 'great');

  // Level-specific opening message
  const openingMessages = {
    1: '📱 Level 1 — Login Screen. Drag the elements into a clean, readable login layout.',
    2: '💳 Level 2 — Checkout. Arrange the payment screen so users can complete purchases without confusion.',
    3: '💻 Level 3 — Dashboard. Build a clear, scannable admin interface.',
  };
  updateLesson(openingMessages[levelNum] || '🎯 Drag elements into their correct positions.');
}

/**
 * Advances to the next level or shows the final score screen.
 */
function nextLevel() {
  const next = gameState.currentLevel + 1;
  if (next <= gameState.totalLevels) {
    document.getElementById('nextBtn').classList.add('hidden');
    loadLevel(next);
  } else {
    showFinalScreen();
  }
}

/* ============================================================
   SUBMIT DESIGN (mid-level check)
============================================================ */

/**
 * Called when player clicks "Submit Design".
 * Evaluates current placement and gives feedback.
 * Doesn't advance level — that's what Next Level is for.
 */
function submitDesign() {
  const config  = levelConfigs[gameState.currentLevel];
  const total   = config.elements.length;
  const snapped = config.elements.filter(c => gameState.snappedElements[c.id]).length;

  if (snapped === total) {
    updateLesson('🏆 Perfect! Everything is correctly placed. Hit Next Level to continue.');
    showToast('🎉 Level complete!');
    document.getElementById('nextBtn').classList.remove('hidden');
  } else {
    const remaining = total - snapped;
    const msgs = [
      `🔍 ${snapped}/${total} elements placed. ${remaining} still need positioning.`,
      `📐 Good start — ${snapped} correct. Keep going with the remaining ${remaining}.`,
      `👁️ ${remaining} element${remaining > 1 ? 's' : ''} still out of place. Look at the Goal panel.`,
    ];
    updateLesson(randomFrom(msgs));
    document.getElementById('feedbackBar').classList.add('warn');
    setTimeout(() => document.getElementById('feedbackBar').classList.remove('warn'), 1500);
  }

  updateScoreDisplay();
  updateProgressBar();
}

/* ============================================================
   HINT SYSTEM
============================================================ */

/**
 * Shows a level-specific hint in the lesson panel.
 */
function showHint() {
  const hints = {
    1: [
      '💡 The logo should be at the top — it\'s the first thing users see.',
      '💡 Email comes before password — that\'s the standard login order.',
      '💡 The Login button is the primary action — make it prominent.',
    ],
    2: [
      '💡 Show the order summary first — users need to know what they\'re paying for.',
      '💡 Card details go on the right — it\'s a two-column checkout layout.',
      '💡 The Pay button should be at the bottom center — wide and obvious.',
    ],
    3: [
      '💡 The sidebar lives on the far left — it\'s navigation, always accessible.',
      '💡 Profile card goes top of the content area — identify the user first.',
      '💡 Stat cards should be side by side — easy visual comparison.',
      '💡 Save button bottom right — it\'s a confirmation action, not primary nav.',
    ],
  };

  const levelHints = hints[gameState.currentLevel] || feedbackMessages.hint;
  updateLesson(randomFrom(levelHints));
  showToast(randomFrom(feedbackMessages.hint));
}

/* ============================================================
   FINAL SCORE SCREEN
============================================================ */

/**
 * Calculates final grade and shows the end screen.
 */
function showFinalScreen() {
  const pct = gameState.maxScore > 0
    ? Math.round((gameState.score / gameState.maxScore) * 100)
    : 0;

  let grade, emoji;
  if (pct >= 90) { grade = 'A+';  emoji = '🏆'; }
  else if (pct >= 80) { grade = 'A';   emoji = '🌟'; }
  else if (pct >= 70) { grade = 'B';   emoji = '👍'; }
  else if (pct >= 60) { grade = 'C';   emoji = '🤔'; }
  else                { grade = 'D';   emoji = '📚'; }

  document.getElementById('finalEmoji').textContent = emoji;
  document.getElementById('finalGrade').textContent = grade + ' — ' + pct + '%';

  const levelNames = ['Login Screen', 'Checkout Screen', 'Dashboard'];
  const scoresHtml = gameState.levelScores.map((s, i) => {
    const max  = gameState.levelMaxes[i];
    const lpct = max > 0 ? Math.round((s / max) * 100) : 0;
    const cls  = lpct >= 80 ? 'great' : lpct >= 60 ? 'ok' : 'poor';
    return `<div class="finalScoreRow">
      <span class="fsr-label">Level ${i+1} — ${levelNames[i]}</span>
      <span class="fsr-val ${cls}">${s}/${max} pts</span>
    </div>`;
  }).join('');

  document.getElementById('finalScores').innerHTML = scoresHtml;
  document.getElementById('finalScreen').classList.remove('hidden');
}

/**
 * Resets the entire game and restarts from Level 1.
 */
function replayGame() {
  // Reset state
  gameState.currentLevel    = 1;
  gameState.score           = 0;
  gameState.maxScore        = 0;
  gameState.levelScores     = [0, 0, 0];
  gameState.levelMaxes      = [0, 0, 0];
  gameState.snappedElements = {};

  // Reset score display
  document.getElementById('scoreNum').textContent = '0';

  // Hide final screen
  document.getElementById('finalScreen').classList.add('hidden');

  // Reset all draggable positions and snapped states
  resetAllElements();

  // Load level 1
  loadLevel(1);
}

/**
 * Resets all draggable elements to their CSS-defined starting positions.
 * Works by removing inline style left/top/width/height.
 */
function resetAllElements() {
  document.querySelectorAll('.draggable').forEach(el => {
    el.style.removeProperty('left');
    el.style.removeProperty('top');
    el.style.removeProperty('width');
    el.style.removeProperty('height');
    el.classList.remove('snapped', 'snap-anim');
  });
  document.querySelectorAll('.dropZone').forEach(z => {
    z.classList.remove('filled', 'hovered');
  });
}

/* ============================================================
   UTILITIES
============================================================ */

/**
 * Returns a random item from an array.
 * @param {Array} arr
 * @returns {*}
 */
function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/* ============================================================
   BUTTON WIRING — connects HTML buttons to JS functions
============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* Intro screen → start game */
  document.getElementById('startGameBtn').addEventListener('click', () => {
    document.getElementById('introScreen').style.display = 'none';
    document.getElementById('gameWrapper').classList.remove('hidden');
    loadLevel(1);
  });

  /* Hint button */
  document.getElementById('hintBtn').addEventListener('click', showHint);

  /* Submit Design button */
  document.getElementById('submitBtn').addEventListener('click', submitDesign);

  /* Next Level button */
  document.getElementById('nextBtn').addEventListener('click', nextLevel);

  /* Replay button on final screen */
  document.getElementById('replayBtn').addEventListener('click', replayGame);

});
