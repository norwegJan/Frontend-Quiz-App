const dmToggle = document.querySelector("#dm-toggle");

const answerInputs = document.querySelectorAll(".answer-input");

dmToggle.addEventListener("change", (e) => {
  console.log(dmToggle.checked);
});

answerInputs.forEach((input) => {
  input.addEventListener("change", (e) => {
    console.log(e.target.value);
  });
});

console.log("test");
