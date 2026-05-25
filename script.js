// DECLARE VARIABLES

const currentSubject = document.querySelectorAll(".current-subject-wrapper");

const dmToggle = document.querySelector("#dm-toggle");
const darkMode = localStorage.getItem("darkMode");

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
    console.log(`${subject} selected`);
    startQuiz(subject);
  });
});

answerInputs.forEach((input, index) => {
  input.addEventListener("change", (e) => {
    updateSelectedAnswer(index);
  });
});

submitBtn.addEventListener("click", () => {
  submitAnswer();
  console.log(isAnswerCorrect());
});

againBtn.addEventListener("click", () => {
  console.log("again-Button clicked");
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
  console.log(quizData);
}

function startQuiz(subject) {
  quizState.selectedQuiz = quizData.quizzes.find((quiz) => {
    return quiz.title === subject;
  });

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
  quizState.progress = quizState.currentQuestionIndex + 1;
  quizState.score = 0;
  quizState.hasSubmitted = false;

  renderQuestion();
}

function renderQuestion() {
  const currentQuestion =
    quizState.selectedQuiz.questions[quizState.currentQuestionIndex];

  const questionNumber = quizState.currentQuestionIndex + 1;
  const totalQuestions = quizState.selectedQuiz.questions.length;

  questionCounter.textContent = questionNumber;
  progressBar.style.width = `${(questionNumber / totalQuestions) * 100}%`;
  questionText.textContent = currentQuestion.question;

  optionTextElements.forEach((optionEl, index) => {
    optionEl.textContent = currentQuestion.options[index];
  });
}

function updateSelectedAnswer(index) {
  const currentQuestion =
    quizState.selectedQuiz.questions[quizState.currentQuestionIndex];

  quizState.selectedAnswer = currentQuestion.options[index];
  quizState.selectedAnswerIndex = index;

  errorMsg.classList.add("hidden");
  console.log(`${quizState.selectedAnswer} (${quizState.selectedAnswerIndex})`);
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

  renderResultState();
  console.log(`Current score is ${quizState.score}`);
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

  submitBtnText.textContent = "Next Question";
}

function nextQuestion() {}

function showCompleted() {}

// INITIATE APP-STATE

if (darkMode === "enabled") {
  dmToggle.checked = true;
  document.body.classList.add("darkmode");
}

initApp();
