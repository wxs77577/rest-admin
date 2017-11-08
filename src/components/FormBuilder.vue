<template>
  <b-form :inline="inline" @submit.prevent="onSubmit">

    <b-form-group :is="inline ? 'div' : 'b-form-group'" :state="!hasError(key)" v-for="(field, key) in fields" :key="key" v-bind="field" :label-for="'input_' + key">

      <label :for="'input_' + key" v-if="inline">{{field.label}}</label>
      <b-form-field v-model="model[key]" :field="field" />
    </b-form-group>

    <slot name="actions">
      <b-button type="submit" variant="primary">{{submitText}}</b-button>
      <b-button type="button" variant="secondary" @click="$router.go(-1)">返回</b-button>
    </slot>
  </b-form>
</template>

<script>

import bUeditor from './UEditor'
import Vue from 'vue'
import bWyiswyg from './Wysiwyg'
// import bMultiselect from 'vue-multiselect'

import bSelect from './Select'
// import bUploader from 'vue-upload-file'
import bUploader from './Uploader'
import bFormField from './FormField'

// import 'vue-multiselect/dist/vue-multiselect.min.css'

export default {
  components: {
    bUeditor,
    bSelect,
    // bMultiselect,
    bWyiswyg,
    bUploader,
    bFormField,
  },
  props: {
    inline: {
      type: Boolean,
      default: false
    },
    value: {
      default() {
        return {}
      }
    },
    fields: {
      required: true,
      default() {
        return {}
      }
    },
    onSubmit: {
      type: Function,
      default() {
        return () => {
          const methodName = String(this.method).toLowerCase()
          this.$http[methodName](this.action, this.model).then(({ data }) => {
            if (this.successMessage) {
              this.$snotify.success(this.successMessage)
            }
            this.errors = []
            this.$emit('success', data)
          }).catch(({ data, status }) => {
            if (status == 422) {
              this.errors = data.error.message
            }
          })
        }
      }
    },
    action: {

    },
    method: {
      default: 'post'
    },
    submitText: {
      default: '保存'
    },
    successMessage: {
      default: '操作成功'
    }
  },
  data() {
    return {
      model: {},
      errors: [],

    };
  },
  watch: {
    value(val) {
      this.model = val
    }
  },
  computed: {

  },
  methods: {

    preview(file) {
      console.log(file);
      if (!file) {
        return
      }
      if (typeof file === 'string') {
        return file
      }
      return URL.createObjectURL(file)
    },
    getFormatter(field, model, key) {
      let value = model[key]
      if (field.format) {
        return eval(field.format)
      }
      return v => v
    },


    hasError(key) {
      return _.find(this.errors, v => v.field == key)
    },
    upload(key) {
      const fd = new FormData()
      fd.append('file', this.model[key])
      this.$http.post('upload', fd).then(({ data }) => {
        Vue.set(this.model, key, data.url)
      })
    },
    setSelectedValue(value, key) {
      Vue.set(this.model, key, _.isObject(value) && false ? value.value : value)

    }
  },
  mounted() {
    this.model = this.value
  },
  created() {

  }
};
</script>

