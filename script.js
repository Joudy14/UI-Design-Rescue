let level = 1;

let score = 0;

let selectedLeft = null;


// =====================
// ELEMENTS
// =====================

const nextBtn =
document.getElementById("nextBtn");

const submitBtn =
document.getElementById("submitBtn");

const phone =
document.getElementById("phone");

const message =
document.getElementById("message");

const scoreBox =
document.getElementById("scoreBox");

const levelBox =
document.getElementById("levelBox");

const progressFill =
document.getElementById("progressFill");

const heroSection =
document.getElementById("heroSection");

const introBox =
document.getElementById("introBox");

const lessonPanel =
document.getElementById("lessonPanel");

const exerciseArea =
document.getElementById("exerciseArea");

const associationArea =
document.getElementById("associationArea");


// =====================
// DRAGGING
// =====================

const draggables =
document.querySelectorAll(".element");

draggables.forEach(element=>{

  element.addEventListener(
    "mousedown",
    startDrag
  );

});

function startDrag(e){

  e.preventDefault();

  const element = e.target;

  const shiftX =
  e.clientX -
  element.getBoundingClientRect().left;

  const shiftY =
  e.clientY -
  element.getBoundingClientRect().top;

  function moveAt(pageX,pageY){

    const phoneRect =
    phone.getBoundingClientRect();

    let x =
    pageX -
    phoneRect.left -
    shiftX;

    let y =
    pageY -
    phoneRect.top -
    shiftY;

    x = Math.max(
      0,
      Math.min(
        x,
        phone.clientWidth -
        element.offsetWidth
      )
    );

    y = Math.max(
      40,
      Math.min(
        y,
        phone.clientHeight -
        element.offsetHeight
      )
    );

    element.style.left =
    x + "px";

    element.style.top =
    y + "px";

  }

  function onMouseMove(e){

    moveAt(
      e.pageX,
      e.pageY
    );

  }

  document.addEventListener(
    "mousemove",
    onMouseMove
  );

  document.addEventListener(
    "mouseup",
    function stopDrag(){

      document.removeEventListener(
        "mousemove",
        onMouseMove
      );

      document.removeEventListener(
        "mouseup",
        stopDrag
      );

    }
  );

}


// =====================
// NEXT BUTTON
// =====================

nextBtn.addEventListener(
"click",
()=>{

  // LEVEL 1

  if(level === 1){

    heroSection.style.display =
    "none";

    introBox.style.display =
    "none";

    phone.style.display =
    "block";

    submitBtn.style.display =
    "block";

    nextBtn.style.display =
    "none";

    lessonPanel.innerHTML =
    `
    <h2>
    🎮 Level 1 — UI Design Rescue
    </h2>

    <br>

    Fix the broken payment page.

    <br><br>

    Improve:
    <br>
    • spacing
    <br>
    • hierarchy
    <br>
    • alignment
    <br>
    • button placement
    `;

  }

  // LEVEL 2

  else if(level === 2){

    startLevel2();

  }

  // LEVEL 3

  else if(level === 3){

    startLevel3();

  }

});


// =====================
// SUBMIT BUTTON
// =====================

submitBtn.addEventListener(
"click",
()=>{

  // =====================
  // LEVEL 1
  // =====================

  if(level === 1){

    const title =
    document.getElementById("title");

    const cardInput =
    document.getElementById("cardInput");

    const nameInput =
    document.getElementById("nameInput");

    const payBtn =
    document.getElementById("payBtn");

    let level1Score = 0;


    // TITLE

    const titleX =
    parseInt(title.style.left);

    if(
      titleX > 90 &&
      titleX < 160
    ){

      level1Score += 25;

    }


    // INPUT ALIGNMENT

    const cardX =
    parseInt(cardInput.style.left);

    const nameX =
    parseInt(nameInput.style.left);

    if(
      Math.abs(cardX - nameX) < 20
    ){

      level1Score += 25;

    }


    // BUTTON CENTER

    const btnX =
    parseInt(payBtn.style.left);

    if(
      btnX > 100 &&
      btnX < 160
    ){

      level1Score += 25;

    }


    // BUTTON LOWER

    const btnY =
    parseInt(payBtn.style.top);

    if(btnY > 600){

      level1Score += 25;

    }


    score = level1Score;

    scoreBox.innerHTML =
    `⭐ Score: ${score}`;


    // FEEDBACK

    if(score >= 75){

      message.innerHTML =
      `
      ✅ Excellent UI Design!

      Great alignment and spacing.
      `;

    }

    else if(score >= 50){

      message.innerHTML =
      `
      🙂 UI Improved,
      but still needs better hierarchy.
      `;

    }

    else{

      message.innerHTML =
      `
      ❌ UI still looks messy.

      Try:
      • aligning elements
      • centering the button
      • improving spacing
      `;

    }


    nextBtn.style.display =
    "block";

    nextBtn.innerText =
    "Go To Level 2";

    submitBtn.style.display =
    "none";

    level = 2;

    progressFill.style.width =
    "66%";

  }


  // =====================
  // LEVEL 2
  // =====================

  else if(level === 2){

    let correct = 0;

    document
    .querySelectorAll(".card")
    .forEach(card=>{

      const selected =
      card.classList.contains(
        "selected"
      );

      const isCorrect =
      card.dataset.correct ===
      "true";

      if(selected && isCorrect){

        correct++;

        card.classList.add(
          "correct"
        );

      }

      else if(selected &&
              !isCorrect){

        card.classList.add(
          "wrong"
        );

      }

    });

    score = correct * 25;

    scoreBox.innerHTML =
    `⭐ Score: ${score}`;

    message.innerHTML =
    `
    ✅ Level 2 Complete!
    `;

    nextBtn.style.display =
    "block";

    nextBtn.innerText =
    "Go To Level 3";

    submitBtn.style.display =
    "none";

    level = 3;

    progressFill.style.width =
    "100%";

  }


  // =====================
  // LEVEL 3
  // =====================

  else if(level === 3){

    message.innerHTML =
    `
    🎉 COURSE COMPLETE!

    You learned:
    • UI hierarchy
    • domain classes
    • associations
    `;

    submitBtn.style.display =
    "none";

    nextBtn.style.display =
    "none";

  }

});


function startLevel2(){

  phone.style.display =
  "none";

  associationArea.style.display =
  "none";

  exerciseArea.style.display =
  "flex";

  nextBtn.style.display =
  "none";

  submitBtn.style.display =
  "block";

  levelBox.innerHTML =
  "Level 2";



  lessonPanel.innerHTML =
  `
  <h2 style="
  color:#bbf7d0;
  margin-bottom:18px;
  ">
  📘 Level 2 — Domain Classes
  </h2>

  <p style="
  line-height:2;
  margin-bottom:20px;
  ">

  Domain classes are important
  objects inside a system.

  Usually they are nouns.

  </p>

  <div class="uiExplanation goodText">

  ✅ Examples:
  Appointment, Product, Driver

  </div>

  <div class="uiExplanation badText">

  ❌ NOT Domain Classes:
  Fast, ID, Names

  </div>

  <div class="uiExplanation noticeText">

  🎯 Exercise:
  Select ONLY domain classes below.

  </div>
  `;



  // DIFFERENT WORDS

  exerciseArea.innerHTML =
  `
  <div class="card"
       data-correct="true">
       Order
  </div>


  <div class="card"
       data-correct="false">
       Quickly
  </div>

  <div class="card"
       data-correct="false">
       Numerical 
  </div>

    <div class="card"
       data-correct="true">
       Appointment
    </div>
  
    <div class="card"
       data-correct="true">
       Grade
  </div>

    <div class="card"
       data-correct="false">
       Beautiful
  </div>
  `;



  document
  .querySelectorAll(".card")
  .forEach(card=>{

    card.addEventListener(
      "click",
      ()=>{

        card.classList.toggle(
          "selected"
        );

      }
    );

  });

}

function startLevel3(){

  exerciseArea.style.display =
  "none";

  associationArea.style.display =
  "flex";

  nextBtn.style.display =
  "none";

  submitBtn.style.display =
  "block";

  levelBox.innerHTML =
  "Level 3";



  lessonPanel.innerHTML =
  `
  <h2 style="
  color:#bbf7d0;
  margin-bottom:18px;
  ">
  🔗 Level 3 — Associations
  </h2>

  <p style="
  line-height:2;
  margin-bottom:20px;
  ">

  Associations show relationships
  between domain classes.

  </p>

  <div class="uiExplanation goodText">

  ✅ Examples:
  Teacher ↔ Classroom
  <br>
  Doctor ↔ Patient

  </div>

  <div class="uiExplanation noticeText">

  🎯 Exercise:
  Match related classes below.

  </div>
  `;



  // DIFFERENT EXERCISE

  document.getElementById(
    "leftColumn"
  ).innerHTML =
  `
   <div class="associationCard left"
       data-match="Menu">
       Student
  </div>

  <div class="associationCard left"
       data-match="Gate">
       Supplier
  </div>

   <div class="associationCard left"
       data-match="Doctor">
       Patient
  </div>
 
  <div class="associationCard left"
       data-match="Book">
       Member
  </div>
  `;



  document.getElementById(
    "rightColumn"
  ).innerHTML =
  `
  <div class="associationCard right"
       data-value="Book">
       Workspace
  </div>

  <div class="associationCard right"
       data-value="Gate">
      Product
  </div>

  <div class="associationCard right"
       data-value="Doctor">
       Doctor
  </div>

  <div class="associationCard right"
       data-value="Menu">
       Course
  </div>
  `;



  let selectedLeft = null;



  // LEFT SIDE

  document
  .querySelectorAll(".left")
  .forEach(card=>{

    card.addEventListener(
      "click",
      ()=>{

        document
        .querySelectorAll(".left")
        .forEach(c=>{

          c.classList.remove(
            "selected"
          );

        });

        card.classList.add(
          "selected"
        );

        selectedLeft = card;

      }
    );

  });



  // RIGHT SIDE

  document
  .querySelectorAll(".right")
  .forEach(card=>{

    card.addEventListener(
      "click",
      ()=>{

        if(!selectedLeft) return;

        const correct =
        selectedLeft.dataset.match;

        const selected =
        card.dataset.value;



        // CORRECT

        if(correct === selected){

          selectedLeft.classList.add(
            "correct"
          );

          card.classList.add(
            "correct"
          );

        }

        // WRONG

        else{

          selectedLeft.classList.add(
            "wrong"
          );

          card.classList.add(
            "wrong"
          );

        }



        selectedLeft.classList.remove(
          "selected"
        );

        selectedLeft = null;

      }
    );

  });

}