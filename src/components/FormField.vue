<template>
      <b-form-select v-if="['select', 'select2'].includes(field.type) && !field.multiple" text-field="label" :value="getFormatter(field, value)(value)" :formatter="getFormatter(field, value)" :id="'input_' + name" v-bind="field" @input="model = arguments[0]" :title="value" />
      <!-- <b-select v-if="['select', 'select2'].includes(field.type)" label="label" v-bind="field" :value="value" @input="setSelectedValue(arguments[0], name)"></b-select> -->
      <!-- <b-multi-select v-if="['select', 'select2'].includes(field.type)" track-by="value" label="text" @input="value = arguments[0].value" :value="value" :id="'input_' + name" v-bind="field" :title="value" /> -->

      <b-form-radio-group v-else-if="['radiolist'].includes(field.type)" v-model="model">
        <b-form-radio :key="choice.value" :value="choice.value" v-for="choice in field.options">{{choice.text}}</b-form-radio>
      </b-form-radio-group>

      <b-form-checkbox-group v-else-if="['checkboxlist'].includes(field.type)" v-model="model">
        <b-form-checkbox :key="choice.value" :value="choice.value" v-for="choice in field.options">{{choice.text}}</b-form-checkbox>
      </b-form-checkbox-group>

      <b-form-textarea v-else-if="['textarea'].includes(field.type)" :id="'input_' + name" v-model="model" v-bind="field" :rows="field.rows || 3" />

      <!-- <b-uploader v-else-if="['image', 'file', 'audio'].includes(field.type)" :id="'input_' + name" v-model="model" v-bind="field" /> -->
      <div v-else-if="['image', 'file', 'audio', 'video'].includes(field.type)">

        <b-form-file :id="'input_' + name" v-model="model" v-bind="field" @input="upload" />
        <div class="preview" v-show="value">
          <b-img v-if="['image'].includes(field.type)" :alt="value + ' 不存在'" :src="preview(value)" v-b-modal="'modal_input_' + name" class="my-2" center fluid v-bind="field.preview" style="max-height: 300px;" />
          <component controls :is="field.type" v-else-if="['audio', 'video'].includes(field.type)" :alt="value" :src="preview(value)" v-b-modal="'modal_input_' + name" class="my-2" center v-bind="field.preview" style="max-height: 300px;"></component>
        </div>

        <b-modal :title="field.label" :id="'modal_input_' + name">
          <b-img :src="preview(value)" class="my-2" center fluid />
        </b-modal>
      </div>

      <b-switch variant="success" pill type="3d" v-else-if="['switch'].includes(field.type)" :id="'input_' + name" v-model="model" />

      <b-ueditor :state="state" v-else-if="['wysiwyg', 'html'].includes(field.type)" :id="'input_' + name" v-bind="field" v-model="model" />

      <b-form-input :state="state" v-else :id="'input_' + name" v-bind="field" v-model="model" :formatter="getFormatter(field, value)" />
</template>

<script>
import bUeditor from "./Ueditor";
import Vue from "vue";
export default {
  components: {
    bUeditor,
  },
  props: {
    value: {},
    field: {},
    state: {},
    name: {},
  },
  data() {
    return {
      model: this.value
    }
  },
  watch: {
    value: 'syncValue',
    model(val){
      this.$emit('input', val)
    }
  },
  methods: {
    getFormatter(field, value) {
      if (field.format) {
        return eval(field.format);
      }
      return v => v;
    },
    upload() {
      const fd = new FormData();
      fd.append("file", this.model);
      this.$http.post("upload", fd).then(({ data }) => {
        this.model = data.url
      });
    },
    preview(file) {
      if (!file) {
        return;
      }
      if (typeof file === "string") {
        return file;
      }
      return URL.createObjectURL(file);
    },
    syncValue(){
      this.model = this.value
    }
  },
  mounted(){
    this.syncValue()
  }
};
</script>
