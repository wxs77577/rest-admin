<template>
  <div ref="editor" :id="id"></div>
</template>

<script>
import Vue from "vue";
import { createEditor } from "vueditor";

export default {
  
  props: {
    id: {},
    value: {
      default: ""
    }
  },
  computed: {},
  data() {
    return {
      // id: "wysiwyg_" + parseInt(Math.random() * 99999),
      editor: null
    };
  },
  methods: {
    handleChange({ target: { checked } }) {
      this.$emit("change", checked ? this.value : this.uncheckedValue);
    },
    update(event) {
      this.$emit("input", event.target.value);
    },
    init() {
      const editor = UE.getEditor(this.id);
      editor.addListener("contentchange", () => {
        this.$emit("input", editor.getContent());
      });
      this.editor = editor;
    }
  },
  mounted() {
    Vue.nextTick(() => {
      const editor = createEditor("#" + this.id, {});
      editor.setContent(this.value);
    });
  },
  created() {
    // this.init()
  }
};
</script>

<style>

</style>
