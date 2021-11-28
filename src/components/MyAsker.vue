<template>
  <div class="my-asker">
    <h3>{{ question }}</h3>

    <div v-if="type == 'choice'">
      <span v-for="(value, index) in choices" :key="index">
        <button
          @click="(answer = value), confirm()"
          :style="getChoiceItemStyle(index)"
          :disabled="isConfirmed"
        >
          {{ value }}</button
        >&nbsp;</span
      >
    </div>

    <form v-else v-on:submit.prevent="confirm">
      <input
        type="text"
        v-model.trim="answer"
        :disabled="isConfirmed"
        :style="answerStyle"
        autocomplete="off"
        placeholder="Your answer"
        required
      />&nbsp;<button :disabled="isConfirmed">Check Answer</button>
    </form>

    <p>{{ resultText }}&nbsp;</p>
  </div>
</template>

<script>
export default {
  name: "MyAsker",
  props: {
    id: { Number, String },
    type: String,
    question: String,
    choices: Array,
    isConfirmed: Boolean,
    isCorrect: Boolean,
  },

  emits: {
    confirm: null,
  },

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
};
</script>
