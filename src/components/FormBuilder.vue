<template>
  <div v-if="model">
    <b-form ref="form" inline @submit.prevent="handleSubmit" v-if="inline" enctype="multipart/form-data">
    <template v-for="(field, name) in fields">
      <label :for="'input_' + name" class="m-1" :key="name">{{field.label || name}}</label>
      <b-form-field :parent="model" class="m-1 mr-4" v-model="model[name]" :id="'input_' + name" :name="name" :field="field" :state="!hasError(name)" :key="id + '_' +name" />
    </template>

    <slot name="actions">
      <b-button type="submit" variant="primary">{{submitText}}</b-button>
      <b-button type="button" variant="secondary" @click="$router.go(-1)" v-if="backText">{{backText}}</b-button>
    </slot>
  </b-form>

  <b-form ref="form" :inline="false" @submit.prevent="handleSubmit" enctype="multipart/form-data" v-else>

    <div class="row" v-if="model">
      <b-form-group :class="getClass(field)"  v-if="isShowField(field) && model" :state="!hasError(name)" v-for="(field, name) in fields" :key="id + '_' +name" v-bind="field" :label-for="'input_' + name">
        <b-form-field :parent="model" v-model="model[name]" :name="name" :field="field" :state="!hasError(name)" :id="'input_' + name" />
      </b-form-group>
    </div>

    <slot name="actions">
      <b-button type="submit" variant="primary">{{submitText}}</b-button>
      <b-button type="button" variant="secondary" @click="$router.go(-1)" v-if="backText">{{backText}}</b-button>
    </slot>
  </b-form>
  </div>
</template>

<script>
import Vue from "vue";

export default {
  name: "b-form-builder",
  components: {},
  props: {
    id: {
      type: String,
      default() {
        return "form_" + parseInt(Math.random() * 9999);
      }
    },
    col: {
      type: Number,
      default: 12
    },
    inline: {
      type: Boolean,
      default: false
    },
    useFormData: {
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
      model: null,
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
    
    isShowField(field) {
      return (
        !field.showWhen || this.model[field.showWhen] || eval(field.showWhen)
      );
    },
    getClass(field) {
      const cols = field.cols ? field.cols : 12;
      const classNames = ["col-xl-" + cols, "col-lg-" + Math.min(12, cols * 2)];
      return classNames
    },
    hasError(name) {
      return _.find(this.errors, v => v.field == name);
    },

    handleSubmit() {
      if (this.onSubmit) {
        return this.onSubmit(this.model);
      }
      const methodName = String(this.method).toLowerCase();
      // console.log(this.$refs.form);
      let formData = this.model;
      if (this.useFormData) {
        formData = new FormData();
        _.mapValues(this.model, (v, k) => formData.append(k, v));
      }
      this.$http[methodName](this.action, formData)
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

