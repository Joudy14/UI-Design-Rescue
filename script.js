/**
 * UI/UX Design Rescue — Game Engine (v4)
 * Pedagogical drag-and-drop trainer for visual hierarchy, Fitts's Law,
 * Hick's Law, and constructivist learning via submit-based evaluation.
 *
 * @file script.js
 */

/* ═══════════════════════════════════════════════════════
   CONSTANTS & CONFIGURATION
   ═══════════════════════════════════════════════════════ */

/** @type {number} Total playable levels across phone, tablet, laptop. */
const TOTAL_LEVELS = 15;

/** @type {number} Base penalty applied per wrong placement on Submit. */
const WRONG_SUBMIT_PENALTY = 25;

/** @type {number} Point cost for contextual hints. */
const HINT_COST = 15;

/** @type {number} Combo threshold that triggers achievement audio. */
const COMBO_ACHIEVEMENT_THRESHOLD = 3;

/** @type {number} SVG timer ring circumference (radius 15.9). */
const CIRCUMFERENCE = 2 * Math.PI * 15.9;

/**
 * Per-level countdown limits (seconds).
 * Phone levels allow slightly more time; laptop dashboards need scanning.
 * @type {Record<number, number>}
 */
const LEVEL_TIME = {
  1: 70, 2: 65, 3: 65, 4: 60, 5: 60,
  6: 55, 7: 55, 8: 55, 9: 50, 10: 50,
  11: 50, 12: 50, 13: 45, 14: 45, 15: 45,
};

/**
 * Image mockup paths — device shell PNGs with screen overlay in CSS.
 * @type {Record<'phone'|'tablet'|'laptop', string>}
 */
const DEVICE_MOCKUPS = {
  phone: "iphone.png",
  tablet: "ipad.png",
  laptop: "macbook.png",
};

const LEVEL_DEVICES = {
  1: "phone", 2: "phone", 3: "phone", 4: "phone", 5: "phone",
  6: "tablet", 7: "tablet", 8: "tablet", 9: "tablet", 10: "tablet",
  11: "laptop", 12: "laptop", 13: "laptop", 14: "laptop", 15: "laptop",
};

/** localStorage key for persisted theme preference */
const THEME_STORAGE_KEY = "ux-rescue-theme";

/**
 * Inline SVG icon library — professional iconography replaces emoji.
 * Lucide-inspired strokes; aria-hidden when used decoratively in tray.
 */
const ICONS = {
  logo: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10 5.522 0 10-4.477 10-10C22 6.477 17.522 2 12 2zm4.587 14.426c-.183.298-.567.393-.865.21-2.368-1.448-5.35-1.776-8.868-.973-.332.076-.66-.134-.736-.465-.075-.332.134-.66.465-.736 3.84-.876 7.127-.497 9.794 1.134.298.183.393.567.21.865zm1.22-3.264c-.23.376-.713.498-1.09.268-2.712-1.667-6.862-2.155-10.37-1.18-.415.114-.84-.13-.954-.545-.114-.415.13-.84.545-.954 3.99-1.107 8.587-.565 11.603 1.285.376.23.498.713.268 1.09zm.106-3.414C14.7 7.842 8.536 7.64 4.966 8.723c-.496.15-1.02-.132-1.17-.628-.15-.496.132-1.02.628-1.17 4.08-1.237 10.9-1.012 14.526 1.136.435.257.578.818.32 1.253-.257.435-.818.578-1.253.32z"/></svg>`,
  mail: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/></svg>`,
  lock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>`,
  login: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><path d="M10 17l5-5-5-5"/><path d="M15 12H3"/></svg>`,
  link: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>`,
  user: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/></svg>`,
  image: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>`,
  text: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/></svg>`,
  bio: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h5"/></svg>`,
  trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/></svg>`,
  save: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/></svg>`,
  cart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>`,
  truck: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M1 3h15v13H1z"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
  card: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></svg>`,
  pay: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>`,
  feed: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>`,
  heart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z"/></svg>`,
  comment: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>`,
  settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`,
  bell: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>`,
  shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  palette: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="13.5" cy="6.5" r="1.5"/><circle cx="17.5" cy="10.5" r="1.5"/><circle cx="8.5" cy="7.5" r="1.5"/><circle cx="6.5" cy="12.5" r="1.5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.657-1.657h1.996A3.64 3.64 0 0022 12c0-5.5-4.5-10-10-10z"/></svg>`,
  logout: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>`,
  grid: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
  keypad: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 8h.01M12 8h.01M16 8h.01M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"/></svg>`,
  home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path d="M9 22V12h6v10"/></svg>`,
  bulb: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 00-4 12.7V17h8v-2.3A7 7 0 0012 2z"/></svg>`,
  temp: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z"/></svg>`,
  scene: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  chef: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 13c0-3 2-5 6-5s6 2 6 5"/><path d="M4 13h16v2a4 4 0 01-4 4H8a4 4 0 01-4-4v-2z"/><path d="M8 6V4M12 6V3M16 6V4"/></svg>`,
  timer: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2"/><path d="M9 2h6"/></svg>`,
  book: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>`,
  bookmark: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>`,
  calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>`,
  event: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/></svg>`,
  chart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 3v18h18"/><path d="M7 16l4-4 4 4 5-6"/></svg>`,
  sidebar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/></svg>`,
  filter: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>`,
  export: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg>`,
  inbox: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/></svg>`,
  compose: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`,
  kanban: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="5" height="18" rx="1"/><rect x="10" y="3" width="5" height="12" rx="1"/><rect x="17" y="3" width="5" height="15" rx="1"/></svg>`,
  task: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>`,
  shop: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 01-8 0"/></svg>`,
  video: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>`,
  timeline: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h4M6 14h8"/></svg>`,
  layers: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
  grip: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg>`,
  clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`,
  target: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
  trophy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 01-10 0V4z"/><path d="M5 4H3v1a4 4 0 004 4M19 4h2v1a4 4 0 01-4 4"/></svg>`,
  close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>`,
};

/**
 * Level curriculum — 15 real-world UI scenarios grouped by device.
 * Each piece maps to exactly one zone via `zone` id.
 */
const lessons = {
  1: { title: "Login Screen", image: "bg.jpg", pieces: [
    { id: "p1logo", label: "Brand Logo", icon: "logo", zone: "z1logo" },
    { id: "p1email", label: "Email Field", icon: "mail", zone: "z1email" },
    { id: "p1password", label: "Password", icon: "lock", zone: "z1password" },
    { id: "p1btn", label: "Sign In", icon: "login", zone: "z1btn" },
    { id: "p1forgot", label: "Forgot Link", icon: "link", zone: "z1forgot" },
  ]},
  2: { title: "Mobile Profile", image: "Dashboard.jpg", pieces: [
    { id: "p2cover", label: "Cover Photo", icon: "image", zone: "z2cover" },
    { id: "p2avatar", label: "Avatar", icon: "user", zone: "z2avatar" },
    { id: "p2name", label: "Display Name", icon: "text", zone: "z2name" },
    { id: "p2bio", label: "Bio", icon: "bio", zone: "z2bio" },
    { id: "p2save", label: "Save", icon: "save", zone: "z2save" },
  ]},
  3: { title: "Mobile Checkout", image: "Checkout.jpg", pieces: [
    { id: "p3summary", label: "Order Summary", icon: "cart", zone: "z3summary" },
    { id: "p3ship", label: "Shipping", icon: "truck", zone: "z3ship" },
    { id: "p3card", label: "Payment Card", icon: "card", zone: "z3card" },
    { id: "p3pay", label: "Pay Button", icon: "pay", zone: "z3pay" },
  ]},
  4: { title: "Social Feed", image: "bg.jpg", pieces: [
    { id: "p4stories", label: "Stories Row", icon: "feed", zone: "z4stories" },
    { id: "p4post", label: "Post Header", icon: "user", zone: "z4post" },
    { id: "p4content", label: "Post Content", icon: "image", zone: "z4content" },
    { id: "p4actions", label: "Action Bar", icon: "heart", zone: "z4actions" },
    { id: "p4comment", label: "Comment Input", icon: "comment", zone: "z4comment" },
  ]},
  5: { title: "App Settings", image: "Dashboard.jpg", pieces: [
    { id: "p5profile", label: "Profile Row", icon: "user", zone: "z5profile" },
    { id: "p5notify", label: "Notifications", icon: "bell", zone: "z5notify" },
    { id: "p5privacy", label: "Privacy", icon: "shield", zone: "z5privacy" },
    { id: "p5theme", label: "Theme", icon: "palette", zone: "z5theme" },
    { id: "p5logout", label: "Sign Out", icon: "logout", zone: "z5logout" },
  ]},
  6: { title: "POS System", image: "Checkout.jpg", pieces: [
    { id: "p6grid", label: "Product Grid", icon: "grid", zone: "z6grid" },
    { id: "p6cart", label: "Cart Panel", icon: "cart", zone: "z6cart" },
    { id: "p6keypad", label: "Numpad", icon: "keypad", zone: "z6keypad" },
    { id: "p6total", label: "Pay Total", icon: "pay", zone: "z6total" },
    { id: "p6tabs", label: "Categories", icon: "filter", zone: "z6tabs" },
  ]},
  7: { title: "Smart Home", image: "Dashboard.jpg", pieces: [
    { id: "p7rooms", label: "Room Selector", icon: "home", zone: "z7rooms" },
    { id: "p7devices", label: "Device Cards", icon: "bulb", zone: "z7devices" },
    { id: "p7thermo", label: "Thermostat", icon: "temp", zone: "z7thermo" },
    { id: "p7scenes", label: "Scenes", icon: "scene", zone: "z7scenes" },
    { id: "p7quick", label: "Quick Actions", icon: "grid", zone: "z7quick" },
  ]},
  8: { title: "Recipe App", image: "bg.jpg", pieces: [
    { id: "p8hero", label: "Hero Image", icon: "image", zone: "z8hero" },
    { id: "p8title", label: "Title & Ingredients", icon: "chef", zone: "z8title" },
    { id: "p8steps", label: "Cooking Steps", icon: "bio", zone: "z8steps" },
    { id: "p8timer", label: "Timer", icon: "timer", zone: "z8timer" },
    { id: "p8servings", label: "Servings", icon: "user", zone: "z8servings" },
  ]},
  9: { title: "E-Reader", image: "bg.jpg", pieces: [
    { id: "p9chapter", label: "Chapter Title", icon: "book", zone: "z9chapter" },
    { id: "p9body", label: "Body Text", icon: "bio", zone: "z9body" },
    { id: "p9progress", label: "Page Progress", icon: "chart", zone: "z9progress" },
    { id: "p9font", label: "Font Control", icon: "text", zone: "z9font" },
    { id: "p9bookmark", label: "Bookmark", icon: "bookmark", zone: "z9bookmark" },
  ]},
  10: { title: "Calendar App", image: "Dashboard.jpg", pieces: [
    { id: "p10header", label: "Month Header", icon: "calendar", zone: "z10header" },
    { id: "p10grid", label: "Week Grid", icon: "grid", zone: "z10grid" },
    { id: "p10events", label: "Event List", icon: "event", zone: "z10events" },
    { id: "p10create", label: "Create Event", icon: "compose", zone: "z10create" },
    { id: "p10nav", label: "Sidebar Nav", icon: "sidebar", zone: "z10nav" },
  ]},
  11: { title: "SaaS Dashboard", image: "Dashboard.jpg", pieces: [
    { id: "p11sidebar", label: "Sidebar Nav", icon: "sidebar", zone: "z11sidebar" },
    { id: "p11kpi", label: "KPI Cards", icon: "chart", zone: "z11kpi" },
    { id: "p11chart", label: "Analytics Chart", icon: "chart", zone: "z11chart" },
    { id: "p11filter", label: "Date Filter", icon: "filter", zone: "z11filter" },
    { id: "p11export", label: "Export Button", icon: "export", zone: "z11export" },
  ]},
  12: { title: "Email Client", image: "bg.jpg", pieces: [
    { id: "p12folders", label: "Folder Sidebar", icon: "inbox", zone: "z12folders" },
    { id: "p12list", label: "Message List", icon: "mail", zone: "z12list" },
    { id: "p12preview", label: "Reading Pane", icon: "bio", zone: "z12preview" },
    { id: "p12compose", label: "Compose Button", icon: "compose", zone: "z12compose" },
  ]},
  13: { title: "Kanban Board", image: "Dashboard.jpg", pieces: [
    { id: "p13title", label: "Project Title", icon: "text", zone: "z13title" },
    { id: "p13todo", label: "To Do Column", icon: "kanban", zone: "z13todo" },
    { id: "p13doing", label: "In Progress", icon: "kanban", zone: "z13doing" },
    { id: "p13done", label: "Done Column", icon: "kanban", zone: "z13done" },
    { id: "p13add", label: "Add Task", icon: "task", zone: "z13add" },
  ]},
  14: { title: "E-commerce Grid", image: "Checkout.jpg", pieces: [
    { id: "p14nav", label: "Store Nav", icon: "shop", zone: "z14nav" },
    { id: "p14filters", label: "Filter Sidebar", icon: "filter", zone: "z14filters" },
    { id: "p14grid", label: "Product Grid", icon: "grid", zone: "z14grid" },
    { id: "p14cart", label: "Cart Icon", icon: "cart", zone: "z14cart" },
  ]},
  15: { title: "Video Editor", image: "Dashboard.jpg", pieces: [
    { id: "p15preview", label: "Preview Monitor", icon: "video", zone: "z15preview" },
    { id: "p15toolbar", label: "Edit Toolbar", icon: "settings", zone: "z15toolbar" },
    { id: "p15timeline", label: "Timeline", icon: "timeline", zone: "z15timeline" },
    { id: "p15layers", label: "Layers Panel", icon: "layers", zone: "z15layers" },
    { id: "p15export", label: "Export", icon: "export", zone: "z15export" },
  ]},
};

/* ═══════════════════════════════════════════════════════
   GLOBAL STATE
   ═══════════════════════════════════════════════════════ */

let currentLevel = 1;
let totalScore = 0;
/** @type {Record<number, number>} */
let levelScores = Object.fromEntries(Array.from({ length: TOTAL_LEVELS }, (_, i) => [i + 1, 0]));
let combo = 0;
let timerInterval = null;
let timeLeft = 60;
let placedCount = 0;
let totalPieces = 0;
/** Whether Submit has been pressed and level awaits fix or advance. */
let levelSubmitted = false;
/** Maps zone DOM id → placed piece id (Submit-Based Evaluation state). */
let placementMap = {};

/* ═══════════════════════════════════════════════════════
   DOM REFERENCES
   ═══════════════════════════════════════════════════════ */

const introScreen = document.getElementById("introScreen");
const targetScreen = document.getElementById("targetScreen");
const gameScreen = document.getElementById("gameScreen");
const finalScreen = document.getElementById("finalScreen");
const strip = document.getElementById("strip");
const stripText = document.getElementById("stripText");
const tbScore = document.getElementById("tbScore");
const tbTimer = document.getElementById("tbTimer");
const timerRing = document.getElementById("timerRing");
const comboWrap = document.getElementById("comboWrap");
const comboBadge = document.getElementById("comboBadge");
const trayItems = document.getElementById("trayItems");
const tpPlaced = document.getElementById("tpPlaced");
const tpTotal = document.getElementById("tpTotal");
const tpFill = document.getElementById("tpFill");
const trayProgress = document.getElementById("trayProgress");
const comboPop = document.getElementById("comboPop");
const btnSubmit = document.getElementById("btnSubmit");
const btnNext = document.getElementById("btnNext");
const btnForceSolve = document.getElementById("btnForceSolve");

/* ═══════════════════════════════════════════════════════
   AUDIO — Place .mp3 files in /audio/ folder at project root
   ═══════════════════════════════════════════════════════ */

/**
 * Sound effect registry.
 * Add files: audio/drop.mp3, submit.mp3, error.mp3, combo.mp3, win.mp3
 */
const sfx = {
  drop: new Audio("audio/drop.mp3"),
  submit: new Audio("audio/submit.mp3"),
  error: new Audio("audio/error.mp3"),
  combo: new Audio("audio/combo.mp3"),
  win: new Audio("audio/win.mp3"),
};

/** @param {keyof typeof sfx} name */
function playSfx(name) {
  try {
    const clip = sfx[name];
    if (!clip?.src) return;
    clip.currentTime = 0;
    clip.volume = 0.45;
    clip.play().catch(() => {});
  } catch (_) {}
}

/* ═══════════════════════════════════════════════════════
   LEVEL PILLS (dynamic — supports 15 levels)
   ═══════════════════════════════════════════════════════ */

function buildLevelPills(containerId, pillClass) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "";
  container.setAttribute("role", "list");
  container.setAttribute("aria-label", "Level progress");

  for (let i = 1; i <= TOTAL_LEVELS; i++) {
    if (i > 1) {
      const line = document.createElement("span");
      line.className = `${pillClass}-line`;
      line.setAttribute("aria-hidden", "true");
      container.appendChild(line);
    }
    const pill = document.createElement("span");
    pill.id = containerId === "tbPills" ? `pill${i}` : `targetPill${i}`;
    pill.className = pillClass;
    pill.textContent = String(i);
    pill.setAttribute("role", "listitem");
    pill.setAttribute("aria-label", `Level ${i}`);
    container.appendChild(pill);
  }
}

/** @param {number} level */
function updateLevelPills(level) {
  for (let i = 1; i <= TOTAL_LEVELS; i++) {
    const gamePill = document.getElementById(`pill${i}`);
    const targetPill = document.getElementById(`targetPill${i}`);
    const suffix = i < level ? " done" : i === level ? " active" : "";
    if (gamePill) gamePill.className = `tb-pill${suffix}`;
    if (targetPill) {
      targetPill.className = `target-pill${suffix}`;
      if (i === level) targetPill.setAttribute("aria-current", "step");
      else targetPill.removeAttribute("aria-current");
    }
  }
}

/* ═══════════════════════════════════════════════════════
   SCREEN NAVIGATION
   ═══════════════════════════════════════════════════════ */

function hideAllScreens() {
  introScreen.style.display = "none";
  targetScreen.style.display = "none";
  gameScreen.style.display = "none";
  finalScreen.style.display = "none";
}

function clearTargetPreview() {
  const mount = document.getElementById("targetDeviceMount");
  if (mount) mount.innerHTML = "";
}

function getLevelWrap(level = currentLevel) {
  return document.getElementById(`lv${level}wrap`);
}

function getScreenEl(level = currentLevel) {
  return getLevelWrap(level)?.querySelector(".device-screen-overlay") ?? null;
}

function getZoneEl(zoneId, level = currentLevel) {
  return getLevelWrap(level)?.querySelector(`#${CSS.escape(zoneId)}`) ?? null;
}

function openTargetScreen(level) {
  hideAllScreens();
  targetScreen.style.display = "flex";
  currentLevel = level;
  updateLevelPills(level);

  const mount = document.getElementById("targetDeviceMount");
  const sourceWrap = getLevelWrap(level);
  mount.innerHTML = "";

  if (sourceWrap) {
    const clone = sourceWrap.cloneNode(true);
    clone.id = `targetClone${level}`;
    clone.classList.remove("hide");
    clone.classList.add("target-preview");
    clone.querySelectorAll("[id]").forEach((el) => {
      if (el !== clone) el.removeAttribute("id");
    });
    const L = lessons[level];
    clone.querySelectorAll(".zone").forEach((z) => {
      z.setAttribute("aria-hidden", "true");
      const pieceId = z.dataset.correct;
      if (pieceId && pieceId !== "none") {
        const div = document.createElement("div");
        div.innerHTML = getPieceHTML(pieceId);
        const piece = div.firstElementChild;
        if (piece) {
          piece.style.position = "absolute";
          piece.style.top = "0";
          piece.style.left = "0";
          piece.style.width = "100%";
          piece.style.height = "100%";
          z.appendChild(piece);
        }
      }
    });
    mount.appendChild(clone);
  }

  const titleEl = document.getElementById("targetLevelTitle");
  if (titleEl) titleEl.textContent = lessons[level]?.title ?? `Level ${level}`;
}

document.getElementById("btnIntroStart").addEventListener("click", () => openTargetScreen(1));
document.getElementById("btnTargetGo").addEventListener("click", () => {
  clearTargetPreview();
  hideAllScreens();
  gameScreen.style.display = "flex";
  loadLevel(currentLevel);
});

/* ═══════════════════════════════════════════════════════
   LOAD LEVEL
   ═══════════════════════════════════════════════════════ */

/** Updates the in-game HUD so the active level is always obvious (levels 1–15). */
function updateLevelTitleBar(level) {
  const bar = document.getElementById("levelTitleBar");
  const L = lessons[level];
  if (!bar || !L) return;
  const device = LEVEL_DEVICES[level];
  bar.textContent = `Level ${level} · ${L.title}`;
  bar.setAttribute("aria-label", `Level ${level}, ${L.title}, ${device} device`);
}

function loadLevel(level) {
  combo = 0;
  placedCount = 0;
  levelSubmitted = false;
  placementMap = {};
  hideCombo();
  updateLevelTitleBar(level);

  document.querySelectorAll(".devWrap").forEach((el) => el.classList.add("hide"));
  const wrap = getLevelWrap(level);
  if (wrap) wrap.classList.remove("hide");

  if (wrap) {
    wrap.querySelectorAll(".zone").forEach((z) => {
      z.className = z.classList.contains("decoy") ? "zone decoy" : "zone";
      z.classList.remove("zone-hover", "zone-correct", "zone-wrong", "zone-filled");
      z.removeAttribute("data-placed-piece");
    });
    wrap.querySelectorAll(".piece.placed").forEach((p) => p.remove());
  }

  const L = lessons[level];
  totalPieces = L.pieces.length;
  tpTotal.textContent = String(totalPieces);
  tpPlaced.textContent = "0";
  tpFill.style.width = "0%";
  if (trayProgress) {
    trayProgress.setAttribute("aria-valuemax", String(totalPieces));
    trayProgress.setAttribute("aria-valuenow", "0");
  }

  buildTray(level);
  updateLevelPills(level);

  const deviceLabel = LEVEL_DEVICES[level];
  setStrip("neutral", `Level ${level}: ${L.title} — arrange elements, then Submit.`);
  btnNext.classList.add("hide");
  btnForceSolve.classList.add("hide");
  btnSubmit.disabled = false;
  btnSubmit.classList.remove("hide");

  startTimer(level);
}

function buildTray(level) {
  trayItems.innerHTML = "";
  const pieces = [...lessons[level].pieces].sort(() => Math.random() - 0.5);

  pieces.forEach((p) => {
    const div = document.createElement("div");
    div.className = "tray-piece";
    div.id = `tray_${p.id}`;
    div.dataset.pieceId = p.id;
    div.setAttribute("role", "listitem");
    div.setAttribute("aria-label", `Draggable component: ${p.label}`);
    div.setAttribute("tabindex", "0");
    div.innerHTML = `
      <span class="tray-piece-label">${p.label}</span>
      <div class="tray-piece-preview" aria-hidden="true">${getPieceHTML(p.id)}</div>
      <span class="sr-only">${p.label}</span>
    `;
    div.addEventListener("mousedown", (e) => startTrayDrag(e, p));
    div.addEventListener("touchstart", (e) => startTrayDragTouch(e, p), { passive: false });
    trayItems.appendChild(div);
  });
}

/* ═══════════════════════════════════════════════════════
   TIMER
   ═══════════════════════════════════════════════════════ */

function startTimer(level) {
  clearInterval(timerInterval);
  timeLeft = LEVEL_TIME[level];
  tbTimer.classList.remove("urgent");
  timerRing.style.stroke = "";
  updateTimerDisplay(timeLeft, LEVEL_TIME[level]);

  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay(timeLeft, LEVEL_TIME[level]);
    if (timeLeft <= 10) {
      tbTimer.classList.add("urgent");
      timerRing.style.stroke = "#EF4444";
      if (timeLeft <= 5) setStrip("time", `${timeLeft}s remaining`);
    }
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timeUp();
    }
  }, 1000);
}

function updateTimerDisplay(t, max) {
  tbTimer.textContent = String(t);
  tbTimer.setAttribute("aria-label", `${t} seconds remaining`);
  timerRing.style.strokeDashoffset = String(CIRCUMFERENCE * (1 - t / max));
  timerRing.style.strokeDasharray = String(CIRCUMFERENCE);
}

function timeUp() {
  tbTimer.textContent = "0";
  setStrip("warn", "Time's up — submitting your layout.");
  btnSubmit.click();
}

/* ═══════════════════════════════════════════════════════
   DRAG & DROP — Submit-Based Evaluation (Constructivist)
   Pieces snap into ANY zone; mistakes are revealed only on Submit.
   ═══════════════════════════════════════════════════════ */

let dragPiece = null;
let floatEl = null;
let dragOffX = 22;
let dragOffY = 22;
let lastDragX = 0;
let cachedZones = [];

function createFloatEl(pieceId) {
  const el = document.createElement("div");
  el.id = "floatPiece";
  el.setAttribute("role", "img");
  el.setAttribute("aria-label", "Dragging UI component");
  el.style.position = "fixed";
  el.style.left = "0px";
  el.style.top = "0px";
  el.style.pointerEvents = "none";
  el.style.willChange = "transform";
  el.style.zIndex = "9999";
  const meta = lessons[currentLevel].pieces.find((p) => p.id === pieceId);
  if (meta) {
    el.innerHTML = `
      <span>${meta.label}</span>
      <div class="float-piece-preview" aria-hidden="true">${getPieceHTML(pieceId)}</div>
    `;
  }
  document.body.appendChild(el);
  return el;
}

function positionFloat(x, y) {
  if (!floatEl) return;
  const dx = x - lastDragX;
  lastDragX = x;
  floatEl.style.transform = `translate3d(${x - dragOffX}px, ${y - dragOffY}px, 0) scale(1.06) rotate(${Math.max(-10, Math.min(10, dx * 1.1))}deg)`;
}

function startTrayDrag(e, pieceMeta) {
  /* Allow rearrangement after a failed Submit — constructivist retry loop. */
  if (levelSubmitted && btnSubmit.disabled) return;
  e.preventDefault();

  /* Re-pick a placed piece: clear its current zone so it can be repositioned. */
  Object.keys(placementMap).forEach((zid) => {
    if (placementMap[zid] === pieceMeta.id) {
      delete placementMap[zid];
      const z = getZoneEl(zid);
      z?.classList.remove("zone-filled", "zone-correct", "zone-wrong");
      z?.removeAttribute("data-placed-piece");
      removePieceFromScreen(pieceMeta.id);
    }
  });
  document.getElementById(`tray_${pieceMeta.id}`)?.classList.remove("tray-placed");
  updatePlacedCount();

  const wrap = getLevelWrap();
  cachedZones = [];
  if (wrap) {
    wrap.querySelectorAll(".zone").forEach((z) => {
      cachedZones.push({ el: z, rect: z.getBoundingClientRect() });
    });
  }

  dragPiece = pieceMeta;
  lastDragX = e.clientX;
  floatEl = createFloatEl(pieceMeta.id);
  positionFloat(e.clientX, e.clientY);
  document.getElementById(`tray_${pieceMeta.id}`)?.classList.add("dragging-from-tray");
  document.addEventListener("mousemove", onTrayDragMove);
  document.addEventListener("mouseup", onTrayDragEnd);
}

function onTrayDragMove(e) {
  positionFloat(e.clientX, e.clientY);
  checkZoneHover(e.clientX, e.clientY);
}

function onTrayDragEnd(e) {
  document.removeEventListener("mousemove", onTrayDragMove);
  document.removeEventListener("mouseup", onTrayDragEnd);
  if (!dragPiece) return;
  tryDrop(e.clientX, e.clientY);
  cleanupDrag();
}

function startTrayDragTouch(e, pieceMeta) {
  if (levelSubmitted && btnSubmit.disabled) return;
  e.preventDefault();

  Object.keys(placementMap).forEach((zid) => {
    if (placementMap[zid] === pieceMeta.id) {
      delete placementMap[zid];
      const z = getZoneEl(zid);
      z?.classList.remove("zone-filled", "zone-correct", "zone-wrong");
      z?.removeAttribute("data-placed-piece");
      removePieceFromScreen(pieceMeta.id);
    }
  });
  document.getElementById(`tray_${pieceMeta.id}`)?.classList.remove("tray-placed");
  updatePlacedCount();

  const wrap = getLevelWrap();
  cachedZones = [];
  if (wrap) {
    wrap.querySelectorAll(".zone").forEach((z) => {
      cachedZones.push({ el: z, rect: z.getBoundingClientRect() });
    });
  }

  dragPiece = pieceMeta;
  const t = e.touches[0];
  lastDragX = t.clientX;
  floatEl = createFloatEl(pieceMeta.id);
  positionFloat(t.clientX, t.clientY);
  document.getElementById(`tray_${pieceMeta.id}`)?.classList.add("dragging-from-tray");
  document.addEventListener("touchmove", onTrayDragMoveTouch, { passive: false });
  document.addEventListener("touchend", onTrayDragEndTouch);
}

function onTrayDragMoveTouch(e) {
  e.preventDefault();
  const t = e.touches[0];
  positionFloat(t.clientX, t.clientY);
  checkZoneHover(t.clientX, t.clientY);
}

function onTrayDragEndTouch(e) {
  document.removeEventListener("touchmove", onTrayDragMoveTouch);
  document.removeEventListener("touchend", onTrayDragEndTouch);
  if (!dragPiece) return;
  tryDrop(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
  cleanupDrag();
}

function cleanupDrag() {
  floatEl?.remove();
  floatEl = null;
  if (dragPiece) {
    document.getElementById(`tray_${dragPiece.id}`)?.classList.remove("dragging-from-tray");
  }
  clearZoneHighlights();
  dragPiece = null;
}

function checkZoneHover(cx, cy) {
  cachedZones.forEach((cz) => {
    const r = cz.rect;
    const inside = cx >= r.left && cx <= r.right && cy >= r.top && cy <= r.bottom;
    cz.el.classList.toggle("zone-hover", inside);
  });
}

function clearZoneHighlights() {
  document.querySelectorAll(".zone-hover").forEach((z) => z.classList.remove("zone-hover"));
}

/**
 * Snap piece into zone without instant rejection — enables experimentation.
 * @param {number} cx
 * @param {number} cy
 */
function tryDrop(cx, cy) {
  const wrap = getLevelWrap();
  if (!wrap || !dragPiece) return;

  let landedZone = null;
  cachedZones.forEach((cz) => {
    const r = cz.rect;
    if (cx >= r.left && cx <= r.right && cy >= r.top && cy <= r.bottom) landedZone = cz.el;
  });

  if (!landedZone) {
    setStrip("warn", "Drop onto a zone on the device screen.");
    return;
  }

  const zoneId = landedZone.id;
  const pieceId = dragPiece.id;

  // Remove piece from any previous zone
  Object.keys(placementMap).forEach((zid) => {
    if (placementMap[zid] === pieceId) {
      delete placementMap[zid];
      const prevZone = getZoneEl(zid);
      prevZone?.classList.remove("zone-filled");
      prevZone?.removeAttribute("data-placed-piece");
    }
  });

  // If zone already has a piece, return it to tray
  if (placementMap[zoneId]) {
    const displaced = placementMap[zoneId];
    document.getElementById(`tray_${displaced}`)?.classList.remove("tray-placed");
    removePieceFromScreen(displaced);
  }

  placementMap[zoneId] = pieceId;
  landedZone.classList.add("zone-filled");
  landedZone.setAttribute("data-placed-piece", pieceId);
  landedZone.classList.remove("zone-correct", "zone-wrong");

  removePieceFromScreen(pieceId);
  placeOnDevice(pieceId, zoneId);
  playSfx("drop");

  document.getElementById(`tray_${pieceId}`)?.classList.add("tray-placed");

  updatePlacedCount();

  setStrip("neutral", `${placedCount}/${totalPieces} placed — click Submit when ready.`);
  levelSubmitted = false;
  btnNext.classList.add("hide");
  btnForceSolve.classList.add("hide");
  wrap.querySelectorAll(".zone").forEach((z) => z.classList.remove("zone-correct", "zone-wrong"));
}

function removePieceFromScreen(pieceId) {
  getScreenEl()?.querySelector(`.piece[data-piece-id="${pieceId}"]`)?.remove();
}

/** Syncs tray progress bar with unique placed pieces (Submit-Based Evaluation). */
function updatePlacedCount() {
  placedCount = new Set(Object.values(placementMap)).size;
  tpPlaced.textContent = String(placedCount);
  tpFill.style.width = `${(placedCount / totalPieces) * 100}%`;
  if (trayProgress) trayProgress.setAttribute("aria-valuenow", String(placedCount));
}

function placeOnDevice(pieceId, zoneId) {
  const screen = getScreenEl();
  const zoneEl = getZoneEl(zoneId);
  if (!screen || !zoneEl) return;

  const div = document.createElement("div");
  div.innerHTML = getPieceHTML(pieceId);
  const piece = div.firstElementChild;
  if (!piece) return;

  piece.classList.add("piece", "placed", "pop-in");
  piece.dataset.pieceId = pieceId;
  piece.setAttribute("role", "img");
  const label = lessons[currentLevel].pieces.find((p) => p.id === pieceId)?.label ?? pieceId;
  piece.setAttribute("aria-label", `Placed: ${label}`);

  /* Use offset properties to ignore CSS transform scaling on the parent device mockups.
     getBoundingClientRect() returns visually scaled bounds which breaks coordinate mapping. */
  piece.style.cssText = `position:absolute;left:${zoneEl.offsetLeft}px;top:${zoneEl.offsetTop}px;width:${zoneEl.offsetWidth}px;height:${zoneEl.offsetHeight}px;z-index:8;`;
  
  screen.appendChild(piece);
  setTimeout(() => piece.classList.remove("pop-in"), 400);
}

/* ═══════════════════════════════════════════════════════
   SUBMIT VALIDATION — delayed grading loop
   ═══════════════════════════════════════════════════════ */

function submitLevel() {
  playSfx("submit");
  clearInterval(timerInterval);

  const L = lessons[currentLevel];
  const wrap = getLevelWrap();
  if (!wrap) return;

  if (placedCount < totalPieces) {
    const missing = totalPieces - placedCount;
    setStrip("warn", `${missing} component${missing > 1 ? "s" : ""} still unplaced.`);
    if (timeLeft > 0) startTimer(currentLevel);
    return;
  }

  let errors = 0;
  let correct = 0;

  /* Clear prior validation styling before re-grading. */
  wrap.querySelectorAll(".zone").forEach((z) => z.classList.remove("zone-correct", "zone-wrong"));

  L.pieces.forEach((p) => {
    const zoneEl = getZoneEl(p.zone);
    const placedInZone = placementMap[p.zone];
    const isCorrect = placedInZone === p.id;

    if (zoneEl) {
      if (isCorrect) {
        zoneEl.classList.add("zone-correct");
        correct++;
      } else {
        zoneEl.classList.add("zone-wrong");
        errors++;
      }
    }
  });

  /* Highlight zones that contain the wrong piece (misplaced swaps). */
  Object.entries(placementMap).forEach(([zoneId, pieceId]) => {
    const zoneEl = getZoneEl(zoneId);
    if (!zoneEl) return;
    if (zoneEl.dataset.correct !== pieceId) {
      zoneEl.classList.add("zone-wrong");
    }
  });

  if (errors > 0) {
    playSfx("error");
    const penalty = errors * WRONG_SUBMIT_PENALTY;
    totalScore = Math.max(0, totalScore - penalty);
    updateScoreDisplay();
    breakCombo();
    btnForceSolve.classList.remove("hide");
    btnNext.classList.add("hide");
    btnSubmit.disabled = false;
    levelSubmitted = false;

    const hints = errors >= 3 ? "Check visual hierarchy and grouping." :
      errors >= 2 ? "Review proximity and alignment." : "One element is misplaced.";
    setStrip("warn", `${errors} error${errors > 1 ? "s" : ""} found. ${hints} (−${penalty} pts)`);
    if (timeLeft > 0) startTimer(currentLevel);
    return;
  }

  levelSubmitted = true;

  // All correct — award points
  playSfx("win");
  const timeBonus = timeLeft * 3;
  const streakBonus = combo >= COMBO_ACHIEVEMENT_THRESHOLD ? 50 : 0;
  if (streakBonus) playSfx("combo");
  const levelGain = 100 + timeBonus + streakBonus;
  totalScore += levelGain;
  levelScores[currentLevel] = (levelScores[currentLevel] || 0) + levelGain;
  combo++;
  updateScoreDisplay();
  if (combo >= COMBO_ACHIEVEMENT_THRESHOLD) {
    updateCombo(combo, streakBonus);
    showComboPop(`Streak ×${combo}`);
  }

  setStrip("great", `Perfect layout! +${levelGain} pts${timeBonus ? ` (${timeBonus} time bonus)` : ""}`);
  btnNext.classList.remove("hide");
  btnForceSolve.classList.add("hide");
  btnSubmit.disabled = true;
}

btnSubmit.addEventListener("click", submitLevel);

/**
 * Force Solve — reveals correct layout for learners who need scaffolding.
 */
btnForceSolve.addEventListener("click", () => {
  autoPlaceCorrect(true);
  playSfx("win");
  setStrip("neutral", "Solution applied — review the correct hierarchy, then continue.");
  btnForceSolve.classList.add("hide");
  btnNext.classList.remove("hide");
  btnSubmit.disabled = true;
  clearInterval(timerInterval);
});

btnNext.addEventListener("click", () => {
  btnNext.classList.add("hide");
  clearInterval(timerInterval);
  const donePill = document.getElementById(`pill${currentLevel}`);
  if (donePill) donePill.className = "tb-pill done";

  currentLevel++;
  if (currentLevel <= TOTAL_LEVELS) {
    openTargetScreen(currentLevel);
  } else {
    openFinalScreen();
  }
});

document.getElementById("btnHint").addEventListener("click", () => {
  totalScore = Math.max(0, totalScore - HINT_COST);
  updateScoreDisplay();
  setStrip("neutral", "Hint: follow top-to-bottom visual hierarchy and F-pattern scanning.");
  breakCombo();
});

document.getElementById("btnReset").addEventListener("click", () => location.reload());

/* ═══════════════════════════════════════════════════════
   PIECE HTML — semantic, accessible component markup
   ═══════════════════════════════════════════════════════ */

function getPieceHTML(id) {
  const pieces = {
    p1logo: `<header class="piece piece--logo"><div class="piece-inner"><span class="ui-mark" aria-hidden="true">${ICONS.logo}</span><span class="ui-brand">Spotify</span></div></header>`,
    p1email: `<section class="piece piece--field"><div class="piece-inner">${ICONS.mail}<input type="email" placeholder="Email address" readonly aria-label="Email"/></div></section>`,
    p1password: `<section class="piece piece--field"><div class="piece-inner">${ICONS.lock}<input type="password" placeholder="Password" readonly aria-label="Password"/></div></section>`,
    p1btn: `<button type="button" class="piece piece--cta" disabled><div class="piece-inner">Sign In</div></button>`,
    p1forgot: `<a class="piece piece--link" href="#" tabindex="-1"><div class="piece-inner">Forgot password?</div></a>`,

    p2cover: `<section class="piece piece--cover"><div class="piece-inner"></div></section>`,
    p2avatar: `<section class="piece piece--avatar"><div class="piece-inner"><div class="avatar-circle" style="background-image: url('avatar.png'); background-size: cover; background-position: center; border: 3px solid #fff; color: transparent;" aria-hidden="true">AM</div></div></section>`,
    p2name: `<section class="piece piece--profile-field"><div class="piece-inner"><span class="field-label">Name</span><span class="field-value">Sarah Jenkins</span></div></section>`,
    p2bio: `<section class="piece piece--profile-field"><div class="piece-inner"><span class="field-label">Bio</span><span class="field-value">Travel & Lifestyle Creator ✈️</span></div></section>`,
    p2save: `<button type="button" class="piece piece--save-btn" disabled><div class="piece-inner">Save Profile</div></button>`,

    p3summary: `<section class="piece piece--summary"><div class="piece-inner"><span class="summary-eyebrow">Order</span><div class="summary-line"><span>Subtotal</span><span>$42.00</span></div><div class="summary-total-line"><span>Total</span><span>$45.99</span></div></div></section>`,
    p3ship: `<section class="piece piece--ship"><div class="piece-inner">${ICONS.truck}<span>Ship to: 124 Ocean Dr, Miami</span></div></section>`,
    p3card: `<section class="piece piece--card-ui"><div class="piece-inner"><div class="card-chip"></div><div class="card-number">4242 ···· ···· 4242</div></div></section>`,
    p3pay: `<button type="button" class="piece piece--pay-btn" disabled><div class="piece-inner">Pay $45.99</div></button>`,

    p4stories: `<nav class="piece piece--stories" aria-label="Stories"><div class="piece-inner"><span class="story-dot"></span><span class="story-dot"></span><span class="story-dot active"></span><span class="story-dot"></span></div></nav>`,
    p4post: `<header class="piece piece--post-header"><div class="piece-inner"><div class="mini-avatar" style="background-image: url('avatar.png'); background-size: cover; background-position: center; color: transparent;">SJ</div><span>Sarah Jenkins</span></div></header>`,
    p4content: `<article class="piece piece--post-content"><div class="piece-inner"><div class="post-img-block" style="background-image: url('post.png'); background-size: cover; background-position: center;"></div></div></article>`,
    p4actions: `<nav class="piece piece--actions" aria-label="Post actions"><div class="piece-inner">${ICONS.heart}<span>18.4k</span>${ICONS.comment}<span>242</span></div></nav>`,
    p4comment: `<section class="piece piece--comment"><div class="piece-inner">Wow, beautiful sunset! 😍...</div></section>`,

    p5profile: `<section class="piece piece--settings-row"><div class="piece-inner">${ICONS.user}<span>Account</span></div></section>`,
    p5notify: `<section class="piece piece--settings-row"><div class="piece-inner">${ICONS.bell}<span>Notifications</span><span class="toggle on"></span></div></section>`,
    p5privacy: `<section class="piece piece--settings-row"><div class="piece-inner">${ICONS.shield}<span>Privacy</span></div></section>`,
    p5theme: `<section class="piece piece--settings-row"><div class="piece-inner">${ICONS.palette}<span>Appearance</span></div></section>`,
    p5logout: `<button type="button" class="piece piece--logout" disabled><div class="piece-inner">${ICONS.logout}<span>Sign Out</span></div></button>`,

    p6grid: `<section class="piece piece--pos-grid"><div class="piece-inner"><span class="pos-item"></span><span class="pos-item"></span><span class="pos-item"></span><span class="pos-item"></span></div></section>`,
    p6cart: `<aside class="piece piece--pos-cart"><div class="piece-inner"><div class="cart-line">Latte ×2</div><div class="cart-line">Muffin ×1</div></div></aside>`,
    p6keypad: `<section class="piece piece--keypad"><div class="piece-inner"><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span></div></section>`,
    p6total: `<button type="button" class="piece piece--pos-total" disabled><div class="piece-inner">Charge $18.50</div></button>`,
    p6tabs: `<nav class="piece piece--pos-tabs" aria-label="Categories"><div class="piece-inner"><span class="tab active">Drinks</span><span class="tab">Food</span></div></nav>`,

    p7rooms: `<nav class="piece piece--rooms" aria-label="Rooms"><div class="piece-inner"><span class="room active">Living</span><span class="room">Bedroom</span></div></nav>`,
    p7devices: `<section class="piece piece--device-cards"><div class="piece-inner"><div class="device-card">${ICONS.bulb}<span>Lights</span></div><div class="device-card">${ICONS.shield}<span>Lock</span></div></div></section>`,
    p7thermo: `<section class="piece piece--thermo"><div class="piece-inner"><span class="temp-val">72°</span><span class="temp-label">Climate</span></div></section>`,
    p7scenes: `<section class="piece piece--scenes"><div class="piece-inner"><span>Movie Night</span><span>Morning</span></div></section>`,
    p7quick: `<section class="piece piece--quick-actions"><div class="piece-inner"><span class="qa-btn">All Off</span><span class="qa-btn">Away</span></div></section>`,

    p8hero: `<figure class="piece piece--recipe-hero"><div class="piece-inner"></div></figure>`,
    p8title: `<header class="piece piece--recipe-title"><div class="piece-inner"><h3>Pasta Primavera</h3><p>Tomato, basil, zucchini</p></div></header>`,
    p8steps: `<section class="piece piece--recipe-steps"><div class="piece-inner"><ol><li>Boil pasta</li><li>Sauté vegetables</li></ol></div></section>`,
    p8timer: `<section class="piece piece--recipe-timer"><div class="piece-inner">${ICONS.timer}<span>12:00</span></div></section>`,
    p8servings: `<section class="piece piece--servings"><div class="piece-inner"><span>Servings</span><strong>4</strong></div></section>`,

    p9chapter: `<header class="piece piece--chapter"><div class="piece-inner"><h2>Chapter 4</h2><p>The Journey Begins</p></div></header>`,
    p9body: `<article class="piece piece--reader-body"><div class="piece-inner"><p>The morning light filtered through tall windows…</p></div></article>`,
    p9progress: `<section class="piece piece--reader-progress"><div class="piece-inner"><div class="progress-bar"><div class="progress-fill"></div></div><span>42%</span></div></section>`,
    p9font: `<section class="piece piece--font-ctrl"><div class="piece-inner"><span>A−</span><span>A</span><span>A+</span></div></section>`,
    p9bookmark: `<button type="button" class="piece piece--bookmark-btn" disabled><div class="piece-inner">${ICONS.bookmark}<span>Bookmark</span></div></button>`,

    p10header: `<header class="piece piece--cal-header"><div class="piece-inner"><span>March 2026</span><span class="cal-nav">&lt; &gt;</span></div></header>`,
    p10grid: `<section class="piece piece--cal-grid"><div class="piece-inner"><span class="cal-day">Mon</span><span class="cal-day active">Tue</span><span class="cal-day">Wed</span><span class="cal-day">Thu</span></div></section>`,
    p10events: `<section class="piece piece--cal-events"><div class="piece-inner"><div class="event-row">Design Review · 10:00</div><div class="event-row">Standup · 14:00</div></div></section>`,
    p10create: `<button type="button" class="piece piece--cal-create" disabled><div class="piece-inner">+ New Event</div></button>`,
    p10nav: `<nav class="piece piece--cal-nav" aria-label="Calendar views"><div class="piece-inner"><span class="active">Month</span><span>Week</span><span>Day</span></div></nav>`,

    p11sidebar: `<nav class="piece piece--dash-sidebar" aria-label="Dashboard"><div class="piece-inner"><div class="sidebar-logo">Metrics</div><div class="nav-link active">Overview</div><div class="nav-link">Reports</div></div></nav>`,
    p11kpi: `<section class="piece piece--kpi-row"><div class="piece-inner"><div class="kpi"><span>Users</span><strong>12.4k</strong></div><div class="kpi"><span>MRR</span><strong>$84k</strong></div></div></section>`,
    p11chart: `<section class="piece piece--dash-chart"><div class="piece-inner"><div class="chart-title">Weekly Growth</div><div class="chart-bars"><span></span><span></span><span></span><span></span><span></span></div></div></section>`,
    p11filter: `<section class="piece piece--date-filter"><div class="piece-inner">${ICONS.filter}<span>Last 30 days</span></div></section>`,
    p11export: `<button type="button" class="piece piece--export-btn" disabled><div class="piece-inner">${ICONS.export}<span>Export CSV</span></div></button>`,

    p12folders: `<nav class="piece piece--email-folders" aria-label="Mail folders"><div class="piece-inner"><div class="folder active">Inbox</div><div class="folder">Sent</div><div class="folder">Drafts</div></div></nav>`,
    p12list: `<section class="piece piece--email-list"><div class="piece-inner"><div class="mail-row active"><strong>Q3 Kickoff</strong><span>10:42 AM</span></div><div class="mail-row"><strong>Invoice #442</strong><span>Yesterday</span></div></div></section>`,
    p12preview: `<article class="piece piece--email-preview"><div class="piece-inner"><h3>Q3 Marketing Kickoff</h3><p>Hey Sarah, let's align on the new campaign deliverables by Friday. See the attached brief. Best, Michael.</p></div></article>`,
    p12compose: `<button type="button" class="piece piece--compose-btn" disabled><div class="piece-inner">${ICONS.compose}<span>Compose</span></div></button>`,

    p13title: `<header class="piece piece--kanban-title"><div class="piece-inner"><h2>Sprint Board</h2></div></header>`,
    p13todo: `<section class="piece piece--kanban-col"><div class="piece-inner"><span class="col-title">To Do</span><div class="kanban-card">Research</div></div></section>`,
    p13doing: `<section class="piece piece--kanban-col doing"><div class="piece-inner"><span class="col-title">In Progress</span><div class="kanban-card">Wireframes</div></div></section>`,
    p13done: `<section class="piece piece--kanban-col done"><div class="piece-inner"><span class="col-title">Done</span><div class="kanban-card">Kickoff</div></div></section>`,
    p13add: `<button type="button" class="piece piece--add-task" disabled><div class="piece-inner">+ Add Task</div></button>`,

    p14nav: `<header class="piece piece--store-nav"><div class="piece-inner"><span class="store-logo">Shop</span><nav aria-label="Categories"><span>Men</span><span>Women</span></nav></div></header>`,
    p14filters: `<aside class="piece piece--store-filters"><div class="piece-inner"><div class="filter-group">Size</div><div class="filter-group">Color</div></div></aside>`,
    p14grid: `<section class="piece piece--product-grid"><div class="piece-inner"><div class="product-card"></div><div class="product-card"></div><div class="product-card"></div><div class="product-card"></div></div></section>`,
    p14cart: `<button type="button" class="piece piece--cart-icon" disabled aria-label="Cart"><div class="piece-inner">${ICONS.cart}<span>3</span></div></button>`,

    p15preview: `<section class="piece piece--video-preview"><div class="piece-inner"><div class="play-btn">${ICONS.video}</div></div></section>`,
    p15toolbar: `<nav class="piece piece--video-toolbar" aria-label="Edit tools"><div class="piece-inner"><span>Cut</span><span>Trim</span><span>FX</span></div></nav>`,
    p15timeline: `<section class="piece piece--video-timeline"><div class="piece-inner"><div class="tl-track"></div><div class="tl-track short"></div><div class="tl-playhead"></div></div></section>`,
    p15layers: `<aside class="piece piece--video-layers"><div class="piece-inner"><div class="layer-row">Video 1</div><div class="layer-row">Audio</div></div></aside>`,
    p15export: `<button type="button" class="piece piece--export-btn" disabled><div class="piece-inner">${ICONS.export}<span>Export MP4</span></div></button>`,
  };
  return pieces[id] || `<div class="piece"><div class="piece-inner"></div></div>`;
}

/* ═══════════════════════════════════════════════════════
   COMBO & SCORE UI
   ═══════════════════════════════════════════════════════ */

let comboPopTimeout = null;

function updateCombo(c, pts) {
  if (c >= 2) {
    comboWrap.classList.remove("hide");
    comboBadge.textContent = `×${c}`;
    if (pts) showComboPop(`Achievement +${pts}`);
  }
}

function showComboPop(text) {
  if (comboPopTimeout) clearTimeout(comboPopTimeout);
  comboPop.textContent = text;
  comboPop.classList.remove("hide");
  comboPop.style.animation = "none";
  void comboPop.offsetWidth;
  comboPop.style.animation = "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards";
  comboPopTimeout = setTimeout(() => comboPop.classList.add("hide"), 1800);
}

function breakCombo() {
  combo = 0;
  comboWrap.classList.add("hide");
}

function hideCombo() {
  comboWrap.classList.add("hide");
}

function updateScoreDisplay() {
  tbScore.textContent = String(totalScore);
  tbScore.classList.add("pop");
  setTimeout(() => tbScore.classList.remove("pop"), 200);
}

function setStrip(type, msg) {
  strip.className = `strip-${type}`;
  stripText.textContent = msg;
}

/* ═══════════════════════════════════════════════════════
   FINAL SCREEN
   ═══════════════════════════════════════════════════════ */

function openFinalScreen() {
  hideAllScreens();
  finalScreen.style.display = "flex";
  document.getElementById("fScoreNum").textContent = String(totalScore);

  let grade = "D";
  if (totalScore >= 1200) grade = "S";
  else if (totalScore >= 950) grade = "A+";
  else if (totalScore >= 750) grade = "A";
  else if (totalScore >= 550) grade = "B";
  else if (totalScore >= 350) grade = "C";

  document.getElementById("fGrade").textContent = grade;
  document.getElementById("fSub").textContent = `${TOTAL_LEVELS} interfaces restored`;

  const bd = document.getElementById("fBreakdown");
  bd.innerHTML = "";
  for (let n = 1; n <= TOTAL_LEVELS; n++) {
    const row = document.createElement("div");
    row.className = "f-row";
    row.innerHTML = `<span class="f-row-label">L${n} ${lessons[n].title}</span><span class="f-row-val">${levelScores[n] || 0}</span>`;
    bd.appendChild(row);
  }
  playSfx("win");
  launchConfetti();
}

function launchConfetti() {
  const container = document.getElementById("confettiContainer");
  const colors = ["#7C3AED", "#EC4899", "#F97316", "#10B981", "#0EA5E9", "#EAB308"];
  for (let i = 0; i < 80; i++) {
    const p = document.createElement("div");
    p.className = "confetti-piece";
    p.setAttribute("aria-hidden", "true");
    p.style.cssText = `left:${Math.random() * 100}%;background:${colors[Math.floor(Math.random() * colors.length)]};width:${6 + Math.random() * 8}px;height:${6 + Math.random() * 8}px;border-radius:${Math.random() > 0.5 ? "50%" : "2px"};animation-duration:${1.5 + Math.random() * 2}s;animation-delay:${Math.random() * 0.8}s;`;
    container.appendChild(p);
  }
  setTimeout(() => { container.innerHTML = ""; }, 4000);
}

document.getElementById("btnReplay").addEventListener("click", () => location.reload());

/* ═══════════════════════════════════════════════════════
   AUTO-PLACE (dev + force solve)
   ═══════════════════════════════════════════════════════ */

function autoPlaceCorrect(markCorrect = false) {
  const L = lessons[currentLevel];
  placementMap = {};
  getLevelWrap()?.querySelectorAll(".piece.placed").forEach((p) => p.remove());
  getLevelWrap()?.querySelectorAll(".zone").forEach((z) => {
    z.classList.remove("zone-filled", "zone-correct", "zone-wrong");
    z.removeAttribute("data-placed-piece");
  });

  L.pieces.forEach((p) => {
    placementMap[p.zone] = p.id;
    const zoneEl = getZoneEl(p.zone);
    zoneEl?.classList.add("zone-filled", markCorrect ? "zone-correct" : "");
    zoneEl?.setAttribute("data-placed-piece", p.id);
    placeOnDevice(p.id, p.zone);
    document.getElementById(`tray_${p.id}`)?.classList.add("tray-placed");
  });

  placedCount = totalPieces;
  tpPlaced.textContent = String(placedCount);
  tpFill.style.width = "100%";
  if (trayProgress) trayProgress.setAttribute("aria-valuenow", String(placedCount));
}

/* ═══════════════════════════════════════════════════════
   CANVAS SPOTLIGHT & SCREEN TRANSITIONS
   ═══════════════════════════════════════════════════════ */

(function initSpotlight() {
  const canvasCol = document.getElementById("canvasCol");
  if (!canvasCol) return;
  const spot = document.createElement("div");
  spot.id = "canvasSpotlight";
  canvasCol.appendChild(spot);
  canvasCol.addEventListener("mouseenter", () => { spot.style.opacity = "1"; });
  canvasCol.addEventListener("mouseleave", () => { spot.style.opacity = "0"; });
  canvasCol.addEventListener("mousemove", (e) => {
    const r = canvasCol.getBoundingClientRect();
    spot.style.left = `${e.clientX - r.left}px`;
    spot.style.top = `${e.clientY - r.top}px`;
  });
})();

(function patchScreenTransitions() {
  ["introScreen", "targetScreen", "gameScreen", "finalScreen"].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    new MutationObserver(() => {
      if (el.style.display && el.style.display !== "none") {
        el.classList.remove("screen-enter");
        void el.offsetWidth;
        el.classList.add("screen-enter");
      }
    }).observe(el, { attributes: true, attributeFilter: ["style"] });
  });
})();

/* ═══════════════════════════════════════════════════════
   DEV MODE
   ═══════════════════════════════════════════════════════ */

let devTimerPaused = false;
const devPanel = document.getElementById("devPanel");

function devLog(msg) {
  const log = document.getElementById("devLog");
  if (!log) return;
  const entry = document.createElement("div");
  entry.textContent = `[${new Date().toLocaleTimeString("en-GB", { hour12: false })}] ${msg}`;
  log.prepend(entry);
  while (log.children.length > 60) log.lastElementChild.remove();
}

function devGoToLevel(lv) {
  if (lv < 1 || lv > TOTAL_LEVELS) return;
  clearInterval(timerInterval);
  devTimerPaused = false;
  currentLevel = lv;
  clearTargetPreview();
  hideAllScreens();
  gameScreen.style.display = "flex";
  updateLevelPills(lv);
  btnNext.classList.add("hide");
  btnForceSolve.classList.add("hide");
  btnSubmit.disabled = false;
  loadLevel(lv);
  devLog(`Level ${lv}`);
}

document.getElementById("btnOpenDev")?.addEventListener("click", () => devPanel.classList.remove("hide"));
document.getElementById("btnCloseDev")?.addEventListener("click", () => devPanel.classList.add("hide"));
document.getElementById("devClearLog")?.addEventListener("click", () => { document.getElementById("devLog").innerHTML = ""; });
document.getElementById("devPauseTimer")?.addEventListener("click", () => { clearInterval(timerInterval); devTimerPaused = true; });
document.getElementById("devResumeTimer")?.addEventListener("click", () => { devTimerPaused = false; startTimer(currentLevel); });
document.getElementById("devAdd30")?.addEventListener("click", () => { timeLeft = Math.min(timeLeft + 30, 999); updateTimerDisplay(timeLeft, LEVEL_TIME[currentLevel]); });
document.getElementById("devSetTimer10")?.addEventListener("click", () => { timeLeft = 10; updateTimerDisplay(10, LEVEL_TIME[currentLevel]); });
document.getElementById("devKillTimer")?.addEventListener("click", () => { clearInterval(timerInterval); timeUp(); });
document.getElementById("devSkipLevel")?.addEventListener("click", () => {
  if (currentLevel >= TOTAL_LEVELS) openFinalScreen();
  else { document.getElementById(`pill${currentLevel}`)?.classList.add("done"); devGoToLevel(currentLevel + 1); }
});
document.getElementById("devPrevLevel")?.addEventListener("click", () => { if (currentLevel > 1) devGoToLevel(currentLevel - 1); });
document.getElementById("devWinLevel")?.addEventListener("click", () => { autoPlaceCorrect(true); submitLevel(); });
document.getElementById("devGoFinal")?.addEventListener("click", openFinalScreen);
document.getElementById("devAutoPlace")?.addEventListener("click", () => autoPlaceCorrect(false));
document.getElementById("devResetPieces")?.addEventListener("click", () => loadLevel(currentLevel));
document.getElementById("devRevealZones")?.addEventListener("click", () => document.body.classList.add("dev-zones-visible"));
document.getElementById("devHideZones")?.addEventListener("click", () => document.body.classList.remove("dev-zones-visible"));
document.getElementById("devAdd500")?.addEventListener("click", () => { totalScore += 500; updateScoreDisplay(); });
document.getElementById("devAdd100")?.addEventListener("click", () => { totalScore += 100; updateScoreDisplay(); });
document.getElementById("devZeroScore")?.addEventListener("click", () => { totalScore = 0; levelScores = Object.fromEntries(Array.from({ length: TOTAL_LEVELS }, (_, i) => [i + 1, 0])); updateScoreDisplay(); });
document.getElementById("devMaxScore")?.addEventListener("click", () => { totalScore = 9999; updateScoreDisplay(); });
document.getElementById("devSetCombo5")?.addEventListener("click", () => { combo = 5; updateCombo(5, 0); });
document.getElementById("devSetCombo10")?.addEventListener("click", () => { combo = 10; updateCombo(10, 0); });
document.getElementById("devBreakCombo")?.addEventListener("click", breakCombo);
document.getElementById("devFlashStrip")?.addEventListener("click", () => setStrip("good", "Dev strip test"));
document.getElementById("devToggleSlow")?.addEventListener("click", () => document.body.classList.toggle("dev-slow"));

function buildDevLevelButtons() {
  const row = document.getElementById("devLevelBtns");
  if (!row) return;
  for (let i = 1; i <= TOTAL_LEVELS; i++) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "dev-btn dev-lvl";
    btn.dataset.lv = String(i);
    btn.textContent = String(i);
    btn.setAttribute("aria-label", `Level ${i}`);
    btn.addEventListener("click", () => devGoToLevel(i));
    row.appendChild(btn);
  }
}

/* ═══════════════════════════════════════════════════════
   THEME — Light / Dark mode with localStorage persistence
   ═══════════════════════════════════════════════════════ */

/** @returns {'light'|'dark'} */
function getTheme() {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

/** @param {'light'|'dark'} theme */
function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (e) { /* private browsing */ }
  updateThemeIcon(theme);
}

function toggleTheme() {
  setTheme(getTheme() === "dark" ? "light" : "dark");
}

/** @param {'light'|'dark'} theme */
function updateThemeIcon(theme) {
  const sun = document.querySelector(".theme-icon-sun");
  const moon = document.querySelector(".theme-icon-moon");
  const btn = document.getElementById("btnThemeToggle");
  if (theme === "dark") {
    sun?.classList.remove("hide");
    moon?.classList.add("hide");
    btn?.setAttribute("aria-label", "Switch to light mode");
    btn?.setAttribute("aria-pressed", "true");
  } else {
    sun?.classList.add("hide");
    moon?.classList.remove("hide");
    btn?.setAttribute("aria-label", "Switch to dark mode");
    btn?.setAttribute("aria-pressed", "false");
  }
}

function initTheme() {
  let saved = null;
  try {
    saved = localStorage.getItem(THEME_STORAGE_KEY);
  } catch (e) { /* ignore */ }
  const theme = saved === "dark" || saved === "light" ? saved : getTheme();
  setTheme(theme);
  document.getElementById("btnThemeToggle")?.addEventListener("click", toggleTheme);
}

/* ═══════════════════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════════════════ */

/**
 * Boot — runs after DOM is ready (script uses defer).
 * Builds 15 level pills; logs version so you can confirm the new bundle loaded.
 */
function bootGame() {
  initTheme();
  const tb = document.getElementById("tbPills");
  const tp = document.getElementById("targetPills");
  if (!tb || !tp) {
    console.error("[UI Design Rescue] Missing #tbPills or #targetPills — reload index.html?v=4");
    return;
  }
  buildLevelPills("tbPills", "tb-pill");
  buildLevelPills("targetPills", "target-pill");
  buildDevLevelButtons();
  document.title = `UI/UX Design Rescue (${TOTAL_LEVELS} levels)`;
  console.info(`[UI Design Rescue] v4 loaded — ${TOTAL_LEVELS} levels, responsive mockups, WYSIWYG tray, theme toggle`);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootGame);
} else {
  bootGame();
}
