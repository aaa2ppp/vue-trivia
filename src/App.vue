<template>
  <!-- <div class="jumbotron">
    <h1>Trivia!</h1>
  </div> -->

  <div class="container">
    <div class="section">
      <div>
        <button @click="askQuestions">Swap questions</button>
        {{ step }}
      </div>
    </div>

    <div class="section">
      <h2>Part 1: Multiple Choice</h2>
      <hr />

      <!-- multiple choice question here -->
      <my-asker type="choice" :="part1" @confirm="checkAnswer" />
    </div>

    <div class="section">
      <h2>Part 2: Free Response</h2>
      <hr />

      <!-- free response question here -->
      <my-asker :="part2" @confirm="checkAnswer" />
    </div>
  </div>
</template>

<script>
import MyAsker from "./components/MyAsker.vue";

const questions = [
  {
    question:
      "The Answer to the Ultimate Question of Life, the Universe, and Everything",
    correctAnswer: [42, "forty too"],
    choices: [12, 93, 42, 6997],
  },
  {
    question: "What do you get if you multiply six by nine?",
    correctAnswer: [54, "fifty four"],
    choices: [89, 14, 42, 73, 54],
  },
];

function askQuestions() {
  let askers = this.askers;
  let questions = this.questions;

  for (let i = 0, j = this.step % 2; i < 2; i++) {
    askers[i].id = j;
    askers[i].question = questions[j].question;
    askers[i].choices = questions[j].choices;
    askers[i].isConfirmed = false;
    askers[i].isCorrect = false;
    j = (j + 1) % 2;
  }

  this.step++;
}

export default {
  name: "App",
  components: {
    MyAsker,
  },

  data: function () {
    let data = {
      step: 0,
      questions: questions,
      askers: [{}, {}],
    };
    askQuestions.call(data);
    return data;
  },

  computed: {
    part1: function () {
      return this.askers[0];
    },
    part2: function () {
      return this.askers[1];
    },
  },

  methods: {
    askQuestions: askQuestions,

    checkAnswer: function (id, answer) {
      console.log("app: checkAnswer:", [id, answer].join(","));

      let question = this.questions[id];
      let asker = this.askers.find((x) => x.id == id);
      const s = ("" + answer).toLowerCase();
      if (Array.isArray(question.correctAnswer)) {
        asker.isCorrect =
          question.correctAnswer.find((x) => x == s) !== undefined;
      } else {
        asker.isCorrec = question.correctAnswer == s;
      }
      asker.isConfirmed = true;
    },
  },
};

// FOR TEST ONLY: disable reload page
window.addEventListener("beforeunload", function (event) {
  let confirmationMessage = "\\o/";
  (event || window.event).returnValue = confirmationMessage; // Gecko + IE
  return confirmationMessage; // Safari, Chrome, and other WebKit-derived browsers
});
</script>

<style src="./styles.css"></style>
