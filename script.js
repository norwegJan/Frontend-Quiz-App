// DECLARE VARIABLES

const currentSubject = document.querySelectorAll(".current-subject-wrapper");

const dmToggle = document.querySelector("#dm-toggle");
const darkMode = localStorage.getItem("darkMode");

const menuContainer = document.querySelector("#menu-container");
const questionsContainer = document.querySelector("#questions-container");
const completedContainer = document.querySelector("#completed-container");

let quizData;

const subjectBtns = document.querySelectorAll(".subject-btn");

const questionCounter = document.querySelector("#question-counter");
const questionText = document.querySelector("#question-text");
const progressBar = document.querySelector("#progress-bar");

const answerOptions = document.querySelectorAll(".answer-option");
const answerInputs = document.querySelectorAll(".answer-input");
const optionTextElements = document.querySelectorAll(".option-text");

const resultIconElements = document.querySelectorAll(".result-icon");
const iconCorrect = `<img src="./assets/images/icon-correct.svg" alt="">`;
const iconIncorrect = `<img src="./assets/images/icon-incorrect.svg" alt="">`;

const submitBtn = document.querySelector("#submit-btn");
const submitBtnText = document.querySelector("#submit-btn-text");
const errorMsg = document.querySelector("#error-wrapper");

const againBtn = document.querySelector("#again-btn");

const finalScore = document.querySelector("#final-score");

const quizState = {
  selectedQuiz: null,
  currentQuestionIndex: 0,
  selectedAnswer: null,
  selectedAnswerIndex: null,
  score: 0,
  hasSubmitted: false,
};

// ADD EVENT LISTENERS

dmToggle.addEventListener("change", (e) => {
  document.body.classList.toggle("darkmode", dmToggle.checked);
  if (dmToggle.checked) {
    localStorage.setItem("darkMode", "enabled");
  } else {
    localStorage.removeItem("darkMode");
  }
});

subjectBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const subject = e.currentTarget.dataset.subject;
    startQuiz(subject);
  });
});

answerInputs.forEach((input, index) => {
  input.addEventListener("change", (e) => {
    updateSelectedAnswer(index);
  });
});

submitBtn.addEventListener("click", () => {
  if (quizState.hasSubmitted) {
    nextQuestion();
    return;
  }

  submitAnswer();
});

againBtn.addEventListener("click", () => {
  resetQuiz();
});

// DECLARE FUNCTIONS

async function getQuizData() {
  try {
    const response = await fetch("data.json");
    if (!response.ok) throw new Error("Data could not be retrieved.");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error.message);
  }
}

async function initApp() {
  quizData = await getQuizData();
  if (quizData) {
    subjectBtns.forEach((btn) => {
      btn.disabled = false;
    });
  }
}

function startQuiz(subject) {
  quizState.selectedQuiz = quizData.quizzes.find((quiz) => {
    return quiz.title === subject;
  });

  menuContainer.classList.add("hidden");
  questionsContainer.classList.remove("hidden");

  currentSubject.forEach((el) => {
    el.innerHTML = `<img
              src="${quizState.selectedQuiz.icon}"
              class="subject-icon ${quizState.selectedQuiz.title}-icon"
              alt=""/>
              <p>${quizState.selectedQuiz.title}</p>`;
  });

  answerInputs.forEach((input) => {
    input.disabled = false;
  });

  submitBtn.disabled = false;

  quizState.currentQuestionIndex = 0;
  quizState.selectedAnswer = null;
  quizState.score = 0;
  quizState.hasSubmitted = false;

  renderQuestion();
}

function renderQuestion() {
  const currentQuestion =
    quizState.selectedQuiz.questions[quizState.currentQuestionIndex];

  const questionNumber = quizState.currentQuestionIndex + 1;
  const totalQuestions = quizState.selectedQuiz.questions.length;
  const progressValue = Math.round((questionNumber / totalQuestions) * 100);

  questionCounter.textContent = questionNumber;
  progressBar.style.width = `${progressValue}%`;
  progressBar.setAttribute("aria-valuenow", progressValue);
  questionText.textContent = currentQuestion.question;

  errorMsg.classList.add("hidden");

  optionTextElements.forEach((optionEl, index) => {
    optionEl.textContent = currentQuestion.options[index];
  });

  answerInputs.forEach((input) => {
    input.checked = false;
  });

  answerOptions.forEach((element) => {
    element.classList.remove("correct");
    element.classList.remove("incorrect");
  });

  resultIconElements.forEach((element) => {
    element.innerHTML = "";
  });

  answerInputs.forEach((input) => {
    input.disabled = false;
  });

  quizState.hasSubmitted = false;
  quizState.selectedAnswer = null;
  quizState.selectedAnswerIndex = null;

  questionText.focus();
}

function updateSelectedAnswer(index) {
  const currentQuestion =
    quizState.selectedQuiz.questions[quizState.currentQuestionIndex];

  quizState.selectedAnswer = currentQuestion.options[index];
  quizState.selectedAnswerIndex = index;

  errorMsg.classList.add("hidden");
}

function isAnswerCorrect() {
  const currentQuestion =
    quizState.selectedQuiz.questions[quizState.currentQuestionIndex];

  return quizState.selectedAnswer === currentQuestion.answer;
}

function submitAnswer() {
  if (quizState.selectedAnswer === null) {
    errorMsg.classList.remove("hidden");
    return;
  }

  if (isAnswerCorrect()) {
    quizState.score += 1;
  }

  quizState.hasSubmitted = true;

  answerInputs.forEach((input) => {
    input.disabled = true;
  });

  renderResultState();

  if (isLastQuestion()) {
    submitBtnText.textContent = "Show Final Result";
  } else {
    submitBtnText.textContent = "Next Question";
  }
}

function isLastQuestion() {
  return (
    quizState.currentQuestionIndex ===
    quizState.selectedQuiz.questions.length - 1
  );
}

function renderResultState() {
  const isCorrect = isAnswerCorrect();

  const currentQuestion =
    quizState.selectedQuiz.questions[quizState.currentQuestionIndex];

  const correctAnswerIndex = currentQuestion.options.findIndex((option) => {
    return option === currentQuestion.answer;
  });

  const selectedAnswerIndex = quizState.selectedAnswerIndex;

  if (isCorrect) {
    answerOptions[selectedAnswerIndex].classList.add("correct");
    resultIconElements[selectedAnswerIndex].innerHTML = iconCorrect;
  } else {
    answerOptions[selectedAnswerIndex].classList.add("incorrect");
    resultIconElements[selectedAnswerIndex].innerHTML = iconIncorrect;
    resultIconElements[correctAnswerIndex].innerHTML = iconCorrect;
  }
}

function nextQuestion() {
  if (isLastQuestion()) {
    showCompleted();
    return;
  }

  quizState.currentQuestionIndex++;
  submitBtnText.textContent = "Submit Answer";
  renderQuestion();
}

function showCompleted() {
  questionsContainer.classList.add("hidden");
  completedContainer.classList.remove("hidden");
  finalScore.textContent = quizState.score;
  againBtn.disabled = false;
  againBtn.focus();
}

function resetQuiz() {
  quizState.selectedQuiz = null;
  quizState.currentQuestionIndex = 0;
  quizState.selectedAnswer = null;
  quizState.selectedAnswerIndex = null;
  quizState.score = 0;
  quizState.hasSubmitted = false;

  completedContainer.classList.add("hidden");
  menuContainer.classList.remove("hidden");

  currentSubject.forEach((el) => {
    el.innerHTML = "";
  });

  finalScore.textContent = 0;

  questionCounter.textContent = 0;
  progressBar.style.width = "0%";
  progressBar.setAttribute("aria-valuenow", 0);
  questionText.textContent =
    "Curabitur semper venenatis lectus viverra ex dictumst nulla maximus?";
  optionTextElements[0].textContent = "Lorem";
  optionTextElements[1].textContent = "Ipsum";
  optionTextElements[2].textContent = "Dolor";
  optionTextElements[3].textContent = "Sit";
  submitBtnText.textContent = "Submit Answer";

  answerInputs.forEach((input) => {
    input.checked = false;
  });

  answerOptions.forEach((element) => {
    element.classList.remove("correct");
    element.classList.remove("incorrect");
  });

  resultIconElements.forEach((element) => {
    element.innerHTML = "";
  });

  answerInputs.forEach((input) => {
    input.disabled = true;
  });

  submitBtn.disabled = true;
  subjectBtns[0].focus();
}

// INITIATE APP

if (darkMode === "enabled") {
  dmToggle.checked = true;
  document.body.classList.add("darkmode");
}

initApp();
