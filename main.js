'use strict';

const questionsArray = [
  // { 
  //   question:  "Who was the creator of the one ring to rule them all?",
  //   answers: ["Frodo", "Golem", "Gandalf", "Sauron"],
  //   correctAnswer: "Sauron"
  // },

  // { 
  //   question:  "Which hobbit accompanied Frodo into Mordor?",
  //   answers: ["Merry", "Pippin", "Samwise", "Bilbo"],
  //   correctAnswer:  "Samwise"
  // },

  // { 
  //   question:  "Aragon was the true heir to the throne of which kingdom?",
  //   answers: ["Gondor", "Rohan", "Numenor", "Dale"],
  //   correctAnswer:  "Gondor"
  // },

  // { 
  //   question: "Who betrayed Frodo in The Fellowship of the Ring?",
  //   answers: ["Faromir", "Boromir", "Saruman", "Gandalf"],
  //   correctAnswer:  "Boromir"
  // },

  // { 
  //   question:  "What is the name of Aragorn’s love?",
  //   answers: ["Eowyn", "Galadriel", "Arwen", "Morwen"],
  //   correctAnswer: "Arwen"
  // },

  // { 
  //   question:  "What kind of creature was Shelob?",
  //   answers: ["Troll", "Dragon", "Snake", "Spider"],
  //   correctAnswer: "Spider"
  // },

  { 
    question:  "What age did Bilbo turn on his birthday in The Fellowship of the Ring?",
    answers: [72, 97, 143, 111],
    correctAnswer:  111
  },

  { 
    question: "Aragorn summoned the aid of an army of ”what” to the battle on Pelennor Fields?",
    answers: ["Dwarves", "Wolves", "the Dead", "Eagles"],
    correctAnswer: "the Dead"

  },

  { 
    question:  "How many members were in the company called the fellowship of the ring?",
    answers: [5, 8, 7, 9],
    correctAnswer: 9
  },

  { 
    question:  "What was the name of the dwarf in the company?",
    answers: ["Balin", "Dwalin", "Gimli", "Gloin"],
    correctAnswer: "Gimli"
  }
];

let state = {
  currentQuestionIndex: 0,
  correctAnswerCount: 0,
}

function stateGetCurrentIndex(){
  return state.currentQuestionIndex;
}

function getQuestionNumber(){
  return state.currentQuestionIndex + 1;
}

function stateGetCorrectAnswerCount(){
  return state.correctAnswerCount;
}

function stateIncrementCorrectCount(){
  state.correctAnswerCount++;
}

function stateIncrementIndex(){
  state.currentQuestionIndex++;
}

function stateReset(){
  state.currentQuestionIndex = 0;
  state.correctAnswerCount = 0;
}

function registerHandlers(){
  // When a user clicks the start button
  $(".home").off();
  $(".home").on("click", "#start", function() {
    $(".home").addClass("hidden");
    $("#quizCard").removeClass("hidden");
    renderQuizCard();
  });

  // When a user submits an answer
  $("#quizCard").off();
  $("#quizCard").on("click", "#submitAnswer", function(event) {
    event.preventDefault();
    const userChoice=$('input[name="answer"]:checked').val();
    checkAnswer(userChoice);
  });  

   // Submits answer when "enter" is hit
  $(".quizAnswers").keydown(function(event) {
    console.log("keyboard");
    if (event.keyCode === 13) {
      $("#submitAnswer").click();
    }
  });  

  // Go to next question
  $("#feedback").off();
  $("#feedback").on("click", "#next", function() {
    stateIncrementIndex();
    if (getQuestionNumber() > questionsArray.length) {
      $("#feedback").addClass("hidden");
      $("#finalResults").removeClass("hidden");
      renderFinalResults();
    }
    else {
      $("#feedback").addClass("hidden");
      $("#quizCard").removeClass("hidden");
      renderQuizCard();
    }
  });

  // Go back to quiz from feedback
  
  $("#feedback").on("click", "#goBack", function() {
    $("#feedback").addClass("hidden");
    $("#quizCard").removeClass("hidden");
  });

  // Clicked to start a new quiz
  $("#finalResults").on("click", "#restartQuiz", function() {
    $("#finalResults").addClass("hidden");
    $(".home").removeClass("hidden");
  });

}

function getAnswer(index) {
 return questionsArray[index].correctAnswer;
}

function renderQuizCard() {
    $(".questionText").empty();
    const quizQuestions=questionsArray[stateGetCurrentIndex()].question;
    $(".questionText").html(quizQuestions);
    questionInfo();
    renderAnswers(questionsArray);
}
  
function questionInfo() {
  $("#questionNumber").html("Question: " + getQuestionNumber() + '/' + questionsArray.length);
  $("#numberCorrect").html("Number correct: "+ stateGetCorrectAnswerCount());
}

function renderAnswers(array) { 
  $(".quizAnswers").empty();
  array[stateGetCurrentIndex()].answers.map(function(item) {
    const template=`<input id="answerChoices" type="radio" name="answer" value="${item}" required><span>${item}</span><br>`;
    $(".quizAnswers").append(template);
  });
}

function createCorrectFeedbackView(){
  return `<img src="https://www.thewrap.com/wp-content/uploads/2015/12/gollum-lord-of-the-rings.jpg" id="imgFeedback" alt="correctAnswerImage"><br>
        <span id="correctAnswer">Correct&#33;</span><br>
        <button class="buttonFeedback" type="button" id="next">Next question</button>`;
}

function createNoAnswerFeedbackView(){
  return `<span id="noAnswer">Choose an answer</span><br><button class="buttonFeedback" type="button" id="goBack">Go back</button>`;
}

function createIncorrectFeedbackView(){
  return `<img src="http://images.mentalfloss.com/sites/default/files/lotr_hed.jpg?resize=1100x740" id="imgFeedback" alt="incorrectAnswerImage"><br>
        <span id="incorrectAnswer">Sorry.  The correct answer was: ${getAnswer(stateGetCurrentIndex())}</span><br>
        <button class="buttonFeedback" type="button" id="next">Next question</button>`;
}

function createPassView(){
  const numberCorrect = stateGetCorrectAnswerCount();
  return `<h3>You Passed!!! Score: ${numberCorrect}/${questionsArray.length}</h3>
        <img src="https://media.giphy.com/media/zGnnFpOB1OjMQ/giphy.gif" id="resultsImage"><br>
        <button id="restartQuiz">Try again?</button>`;
}

function createFailView(){
  const numberCorrect = stateGetCorrectAnswerCount();
  return `<h3>You Failed. Score: ${numberCorrect}/${questionsArray.length}</h3>
          <img src="http://33.media.tumblr.com/5b2b782f40181ba1de4ed7d74e48abaa/tumblr_nk10g3LdNz1rp0vkjo1_500.gif" id="resultsImage"><br>
          <button id="restartQuiz">Try again?</button>`; 
}

function checkAnswer(userChoice) {
  let currentAnswer = getAnswer(stateGetCurrentIndex());
  
  if (userChoice == currentAnswer) {
    alertFeedback(true);
  }
  else if (userChoice === undefined) {
    alertFeedback(undefined);
  }
  else {
    alertFeedback(false);
  }
}

function alertFeedback(result) {
  $("#feedback").empty();
  if (result === true) {
    $("#feedback").append(createCorrectFeedbackView());
    stateIncrementCorrectCount();
  }
  else if (result === undefined) {
    $("#feedback").append(createNoAnswerFeedbackView());
  }
  else if (result === false) {
    $("#feedback").append(createIncorrectFeedbackView());
  }
  
  $("#quizCard").addClass("hidden");
  $("#feedback").removeClass("hidden");
}

function renderFinalResults() {
  const numberCorrect = stateGetCorrectAnswerCount();
  $("#finalResults").empty();
  if (numberCorrect > questionsArray.length / 2) {
    $("#finalResults").append(createPassView());
  }
  else {
    $("#finalResults").append(createFailView());
  }
  startQuiz();
}

function startQuiz(){
  stateReset();
  registerHandlers();
}

// when the page loads, call `startQuiz`
$(startQuiz);

