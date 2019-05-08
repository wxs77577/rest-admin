<template>
  <div>
    <div ref="editor" class="pell html-editor"></div>
    <el-upload
      v-model="file"
      :data="{type: 'html-editor'}"
      :action="API_URI + 'upload'"
      :headers="authHeaders"
      :show-file-list="false"
      :on-success="onUploaded"
      ref="uploader"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
  </div>
</template>

<script>
import "pell/dist/pell.min.css";
import { init, exec } from "pell";
import dompurify from "dompurify";
import { mapGetters } from 'vuex';

// import VueHtml5EditorClass from "vue-html5-editor";

export default {
  components: {},
  props: {
    value: {
      type: String,
      default: ""
    }
  },
  computed: {
    ...mapGetters(["authHeaders", "currentLanguage"]),
  },
  data() {
    return {
      com: "span",
      file: null,
    };
  },
  methods: {
    onUploaded(res){
      exec('insertImage', res.url)
    },
    filter(value) {
      // value = dompurify.sanitize(value)
      return value;
    },
    initEditor() {
      const editor = init({
        element: this.$refs.editor,
        onChange: value => this.$emit("input", this.filter(value)),
        defaultParagraphSeparator: "p",
        styleWithCSS: false,
        actions: [
          "heading1",
          "heading2",
          // "heading3",
          "paragraph",
          "bold",
          "line",
          "link",
          // "image",
          {
            name: "upload",
            icon: "&#128247;",
            title: "上传图片",
            result: () => {
              exec('insertHTML', 'aaaaaaaaaaaaa')
            }
          }
          // "italic",
          // "underline"
        ]
      });
      editor.content.innerHTML = this.value;
    }
  },
  created() {
    this.$nextTick(() => this.initEditor());
  }
};
</script>

<style>
.html-editor {
  line-height: 1em;
}
.html-editor img {
  max-width: 100%;
}
</style>
