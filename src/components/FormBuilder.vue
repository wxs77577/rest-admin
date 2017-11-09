<template>
  <b-form :inline="inline" @submit.prevent="handleSubmit">

    <div v-if="!inline">
      <b-form-group  :state="!hasError(name)" v-for="(field, name) in fields" :key="name" v-bind="field" :label-for="'input_' + name">
        <b-form-field v-model="model[name]" :name="name" :field="field" :state="!hasError(name)" />
      </b-form-group>
    </div>

    <span class="d-flex" v-else >
      <template v-for="(field, name) in fields">
        <label :for="'input_' + name" class="m-1">{{field.label || name}}</label>
        <b-form-field class="m-1" v-model="model[name]" :name="name" :field="field" :state="!hasError(name)" />
      </template>
    </span>

    <slot name="actions">
      <b-button type="submit" variant="primary">{{submitText}}</b-button>
      <b-button type="button" variant="secondary" @click="$router.go(-1)" v-if="backText">{{backText}}</b-button>
    </slot>
  </b-form>
</template>

<script>
import Vue from "vue";
import bFormField from "./FormField";
export default {
  name: 'b-form-builder',
  components: {
    
    bFormField
  },
  props: {
    inline: {
      type: Boolean,
      default: false
    },
    value: {
      default() {
        return {};
      }
    },
    fields: {
      required: true,
      default() {
        return {};
      }
    },
    onSubmit: {
      type: Function,
      required: false
    },
    action: {},
    method: {
      default: "post"
    },
    submitText: {
      default: "保存"
    },
    backText: {
      default: "返回"
    },
    
    successMessage: {
      default: "操作成功"
    }
  },
  data() {
    return {
      model: {},
      errors: []
    };
  },
  watch: {
    value(val) {
      this.model = val;
    }
  },
  computed: {},
  methods: {
    

    hasError(name) {
      return _.find(this.errors, v => v.field == name);
    },
    
    handleSubmit() {
      if (this.onSubmit) {
        return this.onSubmit(this.model);
      }
      const methodName = String(this.method).toLowerCase();
      this.$http
        [methodName](this.action, this.model)
        .then(({ data }) => {
          if (this.successMessage) {
            this.$snotify.success(this.successMessage);
          }
          this.errors = [];
          this.$emit("success", data);
        })
        .catch(({ data, status }) => {
          if (status == 422) {
            this.errors = data.message;
          }
        });
    }
  },
  mounted() {
    this.model = this.value;
  },
  created() {}
};
</script>

