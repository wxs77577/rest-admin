<template>
  <quill-editor class="html-editor" v-model="model" :options="editorOptions"></quill-editor>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor, Quill } from "vue-quill-editor";
import { container, ImageExtend, QuillWatch } from "quill-image-extend-module";
import { mapGetters } from 'vuex';

Quill.register("modules/ImageExtend", ImageExtend);

export default {
  components: {
    quillEditor
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
    ...mapGetters(['authHeaders']),
    model: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    },
    editorOptions() {
      return Object.assign(
        {
          modules: {
            ImageExtend: {
              loading: true,
              name: "file",
              action: this.$http.defaults.baseURL + 'upload',
              headers: xhr => {
                xhr.setRequestHeader('authorization', this.authHeaders.Authorization)
              },
              response: res => res.url,
              success: () => this.$notify.success(this.$t('message.upload_success')),
              error: () => this.$notify.error(this.$t('message.upload_error')),
            },
            toolbar: {
              container: container,
              handlers: {
                image: function() {
                  QuillWatch.emit(this.quill.id);
                }
              }
            }
          }
        },
        this.options
      );
    }
  },
  data() {
    return {};
  },
  created() {}
};
</script>

<style lang="scss">
.html-editor{
  .ql-toolbar {
    line-height: 1em;
  }
  img{
    max-width: 100%;
  }
}
</style>
