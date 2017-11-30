<template>
  <div>
    <b-card >
       <component controls :is="tag" :alt="value" class="item"
      :src="preview(file)" center v-bind="field.preview" @click.stop="showModal = !showModal" />
      <div class="">
      
      </div>
      <div slot="footer" class="text-center">
        <b-form-file ref="file" :id="fileName" v-model="file" 
        v-bind="field" @input="upload" class="d-none" :multiple="false" />
        <label :for="`file_${id}`" class="btn btn-secondary m-0">
          {{file ? '更换' : '选择'}}
        </label>
        <b-btn @click="$emit('remove')">删除</b-btn>
        <b-btn @click="$emit('add')" v-if="allowAdd">添加</b-btn>
      </div>
    </b-card>
    <b-modal :title="field.label">
      <b-img :src="preview(value)" class="my-2" center fluid />
    </b-modal>
  </div>
</template>
<script>
export default {
  name: "b-form-uploader-item",
  props: {
    value: {},
    field: {},
    id: {},
    parent: {},
    name: {},
    allowAdd: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      model: this.value,
      file: this.value,
      current: this.value,
      showModal: false
    };
  },
  watch: {
    value(val) {
      this.file = val;
    }
  },
  computed: {
    modalName(){
      return `modal_${this.id}`
    },
    fileName(){
      return `file_${this.id}`
    },
    tag() {
      return this.field.type == "image" ? "img" : this.field.type;
    }
  },
  methods: {
    upload() {
      if (!this.file) {
        return;
      }
      console.log(this.file);
      const fd = new FormData();
      fd.append("file", this.file);
      fd.append("type", this.name);

      const src = URL.createObjectURL(this.file);

      const doUpload = () => {
        this.$http.post("upload", fd).then(({ data }) => {
          this.file = data.url;
          this.$emit("input", this.file);
        });
      };

      const { width, height, size } = this.field.limit || {};

      if (this.file.size > size) {
        return this.reset(`请上传小于${parseInt(size / 1024)}KB的文件`);
      }

      if (this.file.type.match(/^image/)) {
        let file = new Image();
        file.src = src;
        file.onload = () => {
          if (this.field.limit) {
            if (file.naturalHeight != height || file.naturalWidth != width) {
              return this.reset(`请上传${width}x${height}像素的图片`);
            }
          }
          doUpload();
        };
      } else {
        doUpload();
      }
    },
    preview(file) {
      if (!file) {
        return;
      }
      if (typeof file === "string") {
        return file;
      }
      return URL.createObjectURL(file);
    }
  }
};
</script>

<style scoped>
.current {
  border: 1px solid #c30;
}
.item {
  max-width: 100%;
  max-height: 200px;
}
</style>

