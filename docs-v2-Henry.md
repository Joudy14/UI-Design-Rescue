# UI/UX Design Rescue — Project Report

> **Version:** 4.0.0-responsive-mockups  
> **Status:** ✅ All 15 Levels Complete  
> **Live Demo:** [joudy14.github.io/UI-Design-Rescue](https://joudy14.github.io/UI-Design-Rescue/)

---

## Overview

**UI/UX Design Rescue** is a browser-based educational game where players restore broken user interfaces by dragging UI elements into their correct zones across three device types — iPhone, iPad, and MacBook. The project spans 15 levels, incorporates a timed scoring system, combo multipliers, decoy elements, and a full Dev Mode for testing.

The game teaches core UI/UX layout principles through hands-on interaction, reinforcing correct placement decisions with immediate feedback.

---

## What Was Built

### Core Gameplay Loop

Players are presented with a broken interface mockup displayed on a device frame (phone, tablet, or laptop). A tray of draggable UI elements is provided — some correct, some decoys. The player drags elements into labeled drop zones on the device, then submits for evaluation. Correct placements score points; wrong placements reveal the correct answer automatically, so the player always learns the right solution before moving on.

### Key Features

| Feature | Description |
|---|---|
| **15 Levels** | Progressive difficulty across increasing UI complexity |
| **3 Device Types** | iPhone, iPad, and MacBook mockups — each with device-accurate frames |
| **Timed Rounds** | 60-second countdown per level with pause/resume |
| **Combo Multiplier** | Score multiplier that rewards consecutive correct placements |
| **Decoy Elements** | Misleading UI pieces in the tray to test design knowledge |
| **Hint System** | Available at a -15 point penalty |
| **Auto-Answer on Wrong** | Incorrect submissions reveal the correct placement automatically |
| **Dev Mode** | Full testing panel: skip levels, win instantly, set timer, auto-place, reveal zones |
| **Final Score Screen** | Grade (A+), total points, and a replay option after all 15 levels |

---

## Notable Improvements in v4.0.0

### 1. Responsive Device Mockups
The biggest change in this version is the introduction of **responsive mockups** across all three device types. Prior versions used static frames; v4 adapts the layout to screen size, making the game fully playable on mobile, tablet, and desktop browsers.

### 2. Multi-Device Level Design
Levels now explicitly target different device contexts. Some levels present a **Checkout** flow on iPhone, others a **Settings** screen on iPad, and others a desktop dashboard on MacBook. This gives players real-world exposure to how UI conventions differ across form factors.

### 3. Auto-Answer on Wrong Submission
When a player submits an incorrect arrangement, the game now **automatically reveals the correct solution** via a "View Solution" flow. This turns every mistake into a learning moment rather than a dead end, which is especially valuable for players who are new to UI/UX principles.

### 4. Combo + Multiplier System
A combo multiplier (shown as `x1`, `x5`, `x10`) rewards accuracy streaks. This encourages players to think carefully before placing elements rather than guessing randomly — reinforcing deliberate, correct design decisions.

### 5. Dev Mode Tooling
A comprehensive developer panel was added for testing and demonstration purposes:
- **Skip / Prev / Win Level / Final** — navigate levels freely
- **Auto-Place** — places all elements correctly in one click
- **Reveal / Hide Zones** — toggle drop zone visibility
- **Slow Motion** — slows the game for recording or demonstration
- **Flash Strip / Log** — visual debugging aids

### 6. Score Feedback System
Score increments (`+500`, `+100`) animate on correct placements, giving instant positive feedback. The zero and max score states are also handled gracefully.

---

## Game Structure

```
15 Levels
├── Levels 1–5   → Phone (iPhone) interfaces
├── Levels 6–10  → Tablet (iPad) interfaces
└── Levels 11–15 → Laptop (MacBook) interfaces
```

Each level includes:
- A device mockup with empty drop zones
- A tray of draggable elements (including decoys)
- A 60-second timer
- Submit, Hint, Reset, and View Solution controls

---

## UI/UX Concepts Covered

The game reinforces placement knowledge for common interface components, including:

- Navigation bars and tab bars
- Headers and footers
- Checkout and form flows
- Settings panels and toggle rows
- Search fields and input areas
- Action buttons and CTAs
- Sidebars and content areas (desktop)
- Modals and overlays

---

## Technologies Used

- **HTML5** — semantic structure and game layout
- **CSS3** — device frame styling, animations, responsive design
- **Vanilla JavaScript** — drag-and-drop logic, scoring engine, timer, Dev Mode

No external frameworks or build tools — the entire game runs as a static site deployable directly via GitHub Pages.

---

## How to Run Locally

```bash
git clone https://github.com/joudy14/UI-Design-Rescue.git
cd UI-Design-Rescue
# Open index.html in any modern browser
open index.html
```

No build step required.

---

## Completion Notes

All 15 levels have been completed. When a wrong answer is submitted, the correct solution is shown automatically before proceeding — ensuring every player finishes with the correct UI layout in mind. The final screen awards a grade and total score.

---

## License

This project is open for educational use. Contributions and forks are welcome.
