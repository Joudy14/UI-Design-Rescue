let currentLevel = 1;

let totalScore = 0;

// =====================================================
// MAIN ELEMENTS
// =====================================================

const introScreen =
document.getElementById(
"introScreen"
);

const teachScreen =
document.getElementById(
"teachScreen"
);

const gameScreen =
document.getElementById(
"gameScreen"
);

const finalScreen =
document.getElementById(
"finalScreen"
);

const strip =
document.getElementById(
"strip"
);

const stripText =
document.getElementById(
"stripText"
);

const tbScore =
document.getElementById(
"tbScore"
);

const tbLevel =
document.getElementById(
"tbLevel"
);

const tbFill =
document.getElementById(
"tbFill"
);


// =====================================================
// LESSONS
// =====================================================

const lessons = {

  1: {

    title:"Login Screen UX",

    subtitle:
    "Users should instantly understand how to log in.",

    caption:
    "Good login forms use hierarchy, spacing, and strong CTA visibility.",

    good:[

      "Logo visible at the top",
      "Inputs aligned vertically",
      "CTA button easy to find",
      "Simple clean layout"

    ],

    bad:[

      "Crowded interface",
      "Scattered elements",
      "Weak hierarchy",
      "Confusing reading order"

    ],

    image:"bg.jpg"

  },

  2: {

    title:"Checkout UX",

    subtitle:
    "Payment flows should feel simple and trustworthy.",

    caption:
    "Users must clearly understand order summary, payment details, and final action.",

    good:[

      "Payment information grouped",
      "Order summary visible",
      "Large CTA button",
      "Easy checkout flow"

    ],

    bad:[

      "Scattered payment sections",
      "Tiny payment button",
      "Visual clutter",
      "Poor spacing"

    ],

    image:"Checkout.jpg"

  },

  3: {

    title:"Dashboard UX",

    subtitle:
    "Dashboards must feel organized and easy to scan quickly.",

    caption:
    "A good dashboard uses visual hierarchy, balanced spacing, and grouped analytics.",

    good:[

      "Sidebar grouped together",
      "Cards aligned consistently",
      "Important stats visible first",
      "Balanced spacing"

    ],

    bad:[

      "Random layout placement",
      "No hierarchy",
      "Crowded analytics",
      "Hard navigation"

    ],

    image:"Dashboard.jpg"

  }

};


// =====================================================
// START GAME
// =====================================================

document
.getElementById(
"btnIntroStart"
)
.onclick = ()=>{

  introScreen.style.display =
  "none";

  openTeachScreen(1);

};


// =====================================================
// OPEN TEACH SCREEN
// =====================================================

function openTeachScreen(level){

  teachScreen.style.display =
  "flex";

  document.getElementById(
    "teachTag"
  ).innerText =
  `Level ${level} of 3`;

  document.getElementById(
    "teachTitle"
  ).innerText =
  lessons[level].title;

  document.getElementById(
    "teachSub"
  ).innerText =
  lessons[level].subtitle;

  document.getElementById(
    "teachCaption"
  ).innerText =
  lessons[level].caption;

  document.getElementById(
    "teachImg"
  ).src =
  lessons[level].image;

  const good =
  document.getElementById(
    "teachGood"
  );

  const bad =
  document.getElementById(
    "teachBad"
  );

  good.innerHTML = "";
  bad.innerHTML = "";

  lessons[level].good.forEach(
  item=>{

    good.innerHTML +=
    `<li>${item}</li>`;

  });

  lessons[level].bad.forEach(
  item=>{

    bad.innerHTML +=
    `<li>${item}</li>`;

  });

}


// =====================================================
// START LEVEL
// =====================================================

document
.getElementById(
"btnTeachGo"
)
.onclick = ()=>{

  teachScreen.style.display =
  "none";

  gameScreen.style.display =
  "block";

  loadLevel(currentLevel);

};


// =====================================================
// LOAD LEVEL
// =====================================================

function loadLevel(level){

  tbLevel.innerText =
  level;

  tbFill.style.width =
  `${level * 33}%`;

  strip.className =
  "strip-neutral";

  stripText.innerText =
  "🎯 Drag elements into the correct dashed zones.";

  document
  .querySelectorAll(".devWrap")
  .forEach(el=>{

    el.classList.add(
      "hide"
    );

  });

  document
  .getElementById(
    `lv${level}wrap`
  )
  .classList.remove(
    "hide"
  );

}


// =====================================================
// DRAGGING
// =====================================================

let active = null;

let offsetX = 0;
let offsetY = 0;

document
.querySelectorAll(".piece")
.forEach(piece=>{

  piece.onmousedown =
  startDrag;

});

function startDrag(e){

  active = e.currentTarget;

  offsetX =
  e.clientX -
  active.offsetLeft;

  offsetY =
  e.clientY -
  active.offsetTop;

  active.classList.add(
    "dragging"
  );

  document.onmousemove =
  drag;

  document.onmouseup =
  stopDrag;

}


// =====================================================
// DRAG MOVE
// =====================================================

function drag(e){

  if(!active) return;

  const parent =
  active.parentElement;

  const maxX =
  parent.clientWidth -
  active.offsetWidth;

  const maxY =
  parent.clientHeight -
  active.offsetHeight;

  let x =
  e.clientX - offsetX;

  let y =
  e.clientY - offsetY;

  x =
  Math.max(
    0,
    Math.min(x,maxX)
  );

  y =
  Math.max(
    0,
    Math.min(y,maxY)
  );

  active.style.left =
  x + "px";

  active.style.top =
  y + "px";

  strip.className =
  "strip-neutral";

  stripText.innerText =
  "🔍 Improving readability and hierarchy...";

}


// =====================================================
// STOP DRAG
// =====================================================

function stopDrag(){

  if(!active) return;

  const zone =
  document.getElementById(
    active.dataset.zone
  );

  const p =
  active.getBoundingClientRect();

  const z =
  zone.getBoundingClientRect();

  const overlap =
  !(
    p.right < z.left ||
    p.left > z.right ||
    p.bottom < z.top ||
    p.top > z.bottom
  );

  if(overlap){

    active.style.left =
    zone.offsetLeft + "px";

    active.style.top =
    zone.offsetTop + "px";

    active.style.width =
    zone.offsetWidth + "px";

    active.style.height =
    zone.offsetHeight + "px";

    active.classList.add(
      "placed"
    );

    zone.classList.add(
      "zone-correct"
    );

    if(
      !active.dataset.done
    ){

      active.dataset.done =
      "true";

      totalScore += 20;

      tbScore.innerText =
      totalScore;

    }

    strip.className =
    "strip-good";

    const feedbacks = [

      "✅ Better hierarchy!",
      "👏 Cleaner spacing!",
      "✨ Easier to scan!",
      "📱 Better UX flow!",
      "🎯 Stronger visual structure!",
      "💡 Users will understand this faster!"

    ];

    stripText.innerText =
    feedbacks[
      Math.floor(
        Math.random() *
        feedbacks.length
      )
    ];

  }

  else{

    strip.className =
    "strip-warn";

    stripText.innerText =
    "❌ This still feels visually confusing.";

  }

  active.classList.remove(
    "dragging"
  );

  active = null;

  document.onmousemove = null;
  document.onmouseup = null;

}


// =====================================================
// SUBMIT
// =====================================================

document
.getElementById(
"btnSubmit"
)
.onclick = ()=>{

  const currentWrap =
  document.getElementById(
    `lv${currentLevel}wrap`
  );

  const totalPieces =
  currentWrap.querySelectorAll(
    ".piece"
  ).length;

  const placedPieces =
  currentWrap.querySelectorAll(
    ".placed"
  ).length;

  if(
    placedPieces <
    totalPieces
  ){

    strip.className =
    "strip-warn";

    stripText.innerText =
    "❌ Some elements are still misplaced.";

    return;

  }

  strip.className =
  "strip-great";

  stripText.innerText =
  "🏆 Level Complete!";

  document
  .getElementById(
    "btnNext"
  )
  .classList.remove(
    "hide"
  );

};


// =====================================================
// NEXT LEVEL
// =====================================================

document
.getElementById(
"btnNext"
)
.onclick = ()=>{

  document
  .getElementById(
    "btnNext"
  )
  .classList.add(
    "hide"
  );

  currentLevel++;

  if(currentLevel <= 3){

    gameScreen.style.display =
    "none";

    openTeachScreen(
      currentLevel
    );

  }

  else{

    openFinalScreen();

  }

};


// =====================================================
// HINT BUTTON
// =====================================================

document
.getElementById(
"btnHint"
)
.onclick = ()=>{

  const hints = [

    "💡 Users scan top to bottom.",
    "💡 Important actions should stand out.",
    "💡 Group related content together.",
    "💡 Keep spacing consistent.",
    "💡 Use hierarchy to guide users."

  ];

  strip.className =
  "strip-neutral";

  stripText.innerText =
  hints[
    Math.floor(
      Math.random() *
      hints.length
    )
  ];

};


// =====================================================
// RESET
// =====================================================

document
.getElementById(
"btnReset"
)
.onclick = ()=>{

  location.reload();

};


// =====================================================
// FINAL SCREEN
// =====================================================

function openFinalScreen(){

  gameScreen.style.display =
  "none";

  finalScreen.style.display =
  "flex";

  let grade = "C";

  if(totalScore >= 260){

    grade = "A+";

  }

  else if(totalScore >= 220){

    grade = "A";

  }

  else if(totalScore >= 180){

    grade = "B";

  }

  document
  .getElementById(
    "fGrade"
  )
  .innerText =
  `Final Grade: ${grade}`;

}


// =====================================================
// REPLAY
// =====================================================

document
.getElementById(
"btnReplay"
)
.onclick = ()=>{

  location.reload();

};