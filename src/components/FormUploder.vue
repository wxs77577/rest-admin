<template>
  <div>
    <div class="">
      <b-form-file ref="file" :id="id" v-model="file" v-bind="field" @input="upload" />
    </div>
    <div class="preview" v-show="model" v-if="['audio', 'video', 'image'].includes(field.type)">
      <template v-if="_.isArray(model)">
        <b-draggable v-model="model">
        <component controls @click="current = v" :class="{current: current == v}" v-for="v in value" :key="v" :is="tag" 
         :alt="v" 
        :src="preview(v)" center v-bind="field.preview"/>
        </b-draggable>
      </template>
      <template v-else>
        <component controls :is="tag" :alt="图片不存在" 
        :src="preview(value)" center v-bind="field.preview" />
      </template>
    </div>

    <b-modal :title="field.label" :id="'modal_input_' + name">
      <!-- <b-img :src="preview(value)" class="my-2" center fluid /> -->
    </b-modal>
  </div>
</template>
<script>
import bDraggable from "vuedraggable";
export default {
  name: "b-form-uploader",
  components: {
    bDraggable
  },
  props: {
    value: {},
    field: {},
    id: {},
    parent: {},
    name: {}
  },
  data() {
    return {
      model: this.value,
      file: null,
      current: this.value
    };
  },
  watch: {
    value(val){
      this.model = val
    }
  },
  computed: {
    tag() {
      return this.field.type == "image" ? "img" : this.field.type;
    }
  },
  methods: {
    upload() {
      if (!this.file) {
        return;
      }
      const fd = new FormData();
      fd.append("file", this.file);
      fd.append("type", this.name);

      const src = URL.createObjectURL(this.file);

      const doUpload = () => {
        this.$http.post("upload", fd).then(({ data }) => {
          this.file = data.url;
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

<style>
.current {
  border: 1px solid #c30;
}
</style>

