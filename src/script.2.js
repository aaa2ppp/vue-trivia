(function () {
  "use strict";

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

  const app = Vue.createApp({
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

        asker.isCorrect = Array.isArray(question.correctAnswer)
          ? question.correctAnswer.find(
              (x) => x == ("" + answer).toLowerCase()
            ) !== undefined
          : question.correctAnswer == ("" + answer).toLowerCase();
        asker.isConfirmed = true;
      },
    },
  });

  app.component("my-asker", {
    props: ["id", "type", "question", "choices", "isConfirmed", "isCorrect"],

    data: function () {
      return {
        answer: "",
      };
    },

    computed: {
      resultText: function () {
        if (this.isConfirmed) {
          return this.isCorrect ? "Correct!" : "Incorrect";
        } else {
          return "";
        }
      },

      answerStyle: function () {
        if (!this.isConfirmed) {
          return {};
        } else if (this.isCorrect) {
          return { color: "white", backgroundColor: "green" };
        } else {
          return { color: "white", backgroundColor: "red" };
        }
      },
    },

    watch: {
      question: function () {
        this.clear();
      },
    },

    methods: {
      clear: function () {
        this.answer = "";
      },

      confirm: function () {
        this.$emit("confirm", this.id, this.answer);
      },

      getChoiceItemStyle: function (index) {
        if (this.choices[index] == this.answer) {
          return this.answerStyle;
        } else {
          return {};
        }
      },
    },

    template: `
            <div class="my-asker">
                <h3>{{ question }}</h3>

                <div v-if="type=='choice'">
                    <span v-for="(value, index) in choices" :key="index" >
                        <button v-on:click="answer = value, confirm()" v-bind:style="getChoiceItemStyle(index)" v-bind:disabled="isConfirmed" >
                            {{ value }}
                        </button>
                        &nbsp;
                    </span>
                </div>

                <form v-else v-on:submit.prevent="confirm">
                    <input type="text" v-model.trim="answer"  v-bind:disabled="isConfirmed" v-bind:style="answerStyle" autocomplete="off" placeholder="Your answer" required />
                    <button v-bind:disabled="isConfirmed">Check Answer</button>
                </form>

                <p>{{ resultText }}&nbsp;</p>
            </div>
        `,
  });

  function init() {
    if (document.readyState == "loading") {
      console.log("init: deferred execution");
      document.addEventListener("DOMContentLoaded", init);
      return;
    }

    // FOR TEST ONLY: disable reload page
    window.addEventListener("beforeunload", function (event) {
      let confirmationMessage = "o/";
      (event || window.event).returnValue = confirmationMessage; // Gecko + IE
      return confirmationMessage; // Safari, Chrome, and other WebKit-derived browsers
    });

    app.mount("#app");
  }

  init();
})();
