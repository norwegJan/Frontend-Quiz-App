// DECLARE VARIABLES

const dmToggle = document.querySelector("#dm-toggle");
const bodyEl = document.querySelector("#body");
const dmEls = document.querySelectorAll(".dm-el");
const outOfEl = document.querySelector("#out-of-el");

const answerInputs = document.querySelectorAll(".answer-input");

// ADD EVENT LISTENERS

dmToggle.addEventListener("change", (e) => {
  if (!dmToggle.checked) {
    bodyEl.classList.remove("darkmode");
    dmEls.forEach((el) => el.classList.remove("darkmode-active"));
    outOfEl.classList.remove("darkmode-out-of");
  } else {
    bodyEl.classList.add("darkmode");
    dmEls.forEach((el) => el.classList.add("darkmode-active"));
    outOfEl.classList.add("darkmode-out-of");
  }
});

/* answerInputs.forEach((input) => {
  input.addEventListener("change", (e) => {
    console.log(e.target.value);
  });
}); */

// DECLARE FUNCTIONS
