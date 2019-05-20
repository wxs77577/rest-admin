<template>
  <vue-editor
    class="html-editor"
    v-model="model"
    :options="editorOptions"
    useCustomImageHandler
    @imageAdded="handleImageAdded"
  ></vue-editor>
</template>

<script>

import { VueEditor, Quill } from "vue2-editor";
import { mapGetters } from "vuex";

import _ from "lodash";

export default {
  components: {
    VueEditor
  },
  props: {
    value: {
      type: String,
      default: ""
    },
    options: {
      default() {
        return {};
      }
    }
  },
  computed: {
    ...mapGetters(["authHeaders"]),
    model: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    },
    editorOptions() {
      return _.merge(
        {
          height: 300,
          modules: {
            
          }
        },
        this.options
      );
    }
  },
  data() {
    return {};
  },
  methods: {
    async handleImageAdded(file, Editor, cursorLocation, resetUploader) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await this.$http.post("upload", formData);
      Editor.insertEmbed(cursorLocation, "image", res.data.url);
      resetUploader();
    }
  },
  created() {}
};
</script>

<style lang="scss">
.ql-snow .ql-toolbar button svg, .quillWrapper .ql-snow.ql-toolbar button svg{
  width: 18px !important;
  height: 18px !important;
}
.html-editor {
  .ql-toolbar {
    line-height: 1em;
    border-top-left-radius: var(--rounded);
    border-top-right-radius: var(--rounded);
  }
  .ql-container {
    border-bottom-left-radius: var(--rounded);
    border-bottom-right-radius: var(--rounded);
    .ql-editor {
      min-height: 15rem;
      max-height: 25rem;
    }
  }

  img {
    max-width: 100%;
  }
}
</style>
