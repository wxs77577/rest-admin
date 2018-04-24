<template>
  <div>
    <b-card>
      <b-data-value class="text-center" :field="field" :name="name" :model="parent"/>
      <div class="text-center text-muted mt-2" v-if="field.limit && field.limit.width">
        {{$t('messages.image_size', field.limit)}}
      </div>
      <div slot="footer" class="text-center">
        <b-form-file ref="file" :id="fileName" v-model="file" 
        v-bind="field" @input="upload" class="d-none" :multiple="false" />
        <label :for="`file_${id}`" class="btn btn-secondary m-0">
          {{file ? $t('actions.change') : $t('actions.choose')}}
        </label>
        <b-btn @click="$emit('remove')">{{$t('actions.delete')}}</b-btn>
        <b-btn @click="$emit('add')" v-if="allowAdd">{{$t('actions.add')}}</b-btn>
      </div>
    </b-card>
    
  </div>
</template>
<script>
import bDataValue from "./DataValue";

export default {
  name: "b-form-uploader-item",
  components: {
    bDataValue
  },
  props: {
    value: {},
    field: {},
    id: {},
    parent: {},
    name: {},
    allowAdd: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      model: this.value,
      file: this.value,
      current: this.value,
      fileData: {}
    };
  },
  watch: {
    value(val) {
      this.file = val;
    }
  },
  computed: {
    text() {
      return String(this.value)
        .split("/")
        .pop();
    },
    modalName() {
      return `modal_${this.id}`;
    },
    fileName() {
      return `file_${this.id}`;
    },
    tag() {
      const tags = {
        image: "img",
        audio: "audio",
        video: "video"
      };
      return tags[this.field.type] ? tags[this.field.type] : "div";
    }
  },
  methods: {
    reset(error) {
      if (error) {
        this.$snotify.error(error);
      }
      this.model = this.oldValue;
      return false;
    },
    upload() {
      if (!this.file) {
        return;
      }
      const fd = new FormData();
      fd.append("file", this.file);
      fd.append("type", this.name);
      this.fileData = this.file;

      const src = URL.createObjectURL(this.file);

      const doUpload = () => {
        this.$http.post("upload", fd).then(({ data }) => {
          this.file = data.url;
          this.$emit("input", this.file);
          this.$snotify.success(this.$t("messages.uploaded"));
        });
      };

      const { width, height, size } = this.field.limit || {};

      if (this.file.size > size) {
        return this.reset(
          this.$t("errors.too_large", { limit: parseInt(size / 1024) })
        );
      }

      if (this.file.type.match(/^image/)) {
        let file = new Image();
        file.src = src;
        file.onload = () => {
          if (this.field.limit) {
            if (file.naturalHeight != height || file.naturalWidth != width) {
              return this.reset(
                this.$t("errors.wrong_size", { width, height })
              );
            }
          }
          doUpload();
        };
      } else {
        doUpload();
      }
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

