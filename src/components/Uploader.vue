<template>
  <div>
    <b-dropzone ref="uploader" :id="id" :options="options" @vdropzone-success="uploaded">
    </b-dropzone>
    <div :id="previewId"></div>
  </div>
</template>

<script>
import Vue from "vue";
import bDropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.css'

export default {
  components: {
    bDropzone
  },
  props: {
    id: {},
    type: {
      default: 'image'
    },
    url: {
      default() {
        return global.API_URI + 'upload'
      }
    },
    multiple: {
      default: false
    },
    tag: {
      default() {
        return this.type == 'image' ? 'img' : this.type
      }
    },
    options: {
      type: Object,
      default() {
        return {}
      }
    },
    value: {
      default: ""
    }
  },
  computed: {
    previewId() {
      return 'preview_' + this.id
    }
  },
  data() {
    return {
    };
  },
  methods: {
    uploaded(file, response) {
      this.$emit('input', response.url)
    },

  },
  mounted() {
    this.options = Object.assign({
      url: this.url,
      maxFiles: this.multiple ? 10 : 1,
      maxFilesize: 100,
      addRemoveLinks: true,
      previewsContainer: '#' + this.previewId,
      previewTamplte: `
            <div class="dz-preview dz-file-preview">
              <div class="dz-details">
                <div class="dz-filename"><span data-dz-name></span></div>
                <div class="dz-size" data-dz-size></div>
                <${this.tag} data-dz-thumbnail />
              </div>
              <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
              <div class="dz-success-mark"><span>✔</span></div>
              <div class="dz-error-mark"><span>✘</span></div>
              <div class="dz-error-message"><span data-dz-errormessage></span></div>
            </div>
          `
    }, this.options)
    setTimeout(() => {
      this.$refs.uploader.manuallyAddFile({
        name: this.value,
      }, this.value)
    }, 100)
  },
  created() {
    
  }
};
</script>

<style>

</style>
