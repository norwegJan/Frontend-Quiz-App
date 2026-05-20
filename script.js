// DECLARE VARIABLES

const dmToggle = document.querySelector("#dm-toggle");
const darkMode = localStorage.getItem("darkMode");

const htmlBtn = document.querySelector("#html-btn");
const cssBtn = document.querySelector("#css-btn");
const jsBtn = document.querySelector("#js-btn");
const a11yBtn = document.querySelector("#a11y-btn");

const answerInputs = document.querySelectorAll(".answer-input");

const submitBtn = document.querySelector("#submit-btn");
const againBtn = document.querySelector("#again-btn");

// ADD EVENT LISTENERS

dmToggle.addEventListener("change", (e) => {
  document.body.classList.toggle("darkmode", dmToggle.checked);
  if (dmToggle.checked) {
    localStorage.setItem("darkMode", "enabled");
  } else {
    localStorage.removeItem("darkMode");
  }
});

if (darkMode === "enabled") {
  dmToggle.checked = true;
  document.body.classList.add("darkmode");
}

htmlBtn.addEventListener("click", () => {
  console.log("HTML-Button clicked");
});

cssBtn.addEventListener("click", () => {
  console.log("CSS-Button clicked");
});

jsBtn.addEventListener("click", () => {
  console.log("JS-Button clicked");
});

a11yBtn.addEventListener("click", () => {
  console.log("A11Y-Button clicked");
});

answerInputs.forEach((input) => {
  input.addEventListener("change", (e) => {
    console.log(e.target.value);
  });
});

submitBtn.addEventListener("click", () => {
  console.log("Submit-Button clicked");
});

againBtn.addEventListener("click", () => {
  console.log("again-Button clicked");
});

// DECLARE FUNCTIONS
