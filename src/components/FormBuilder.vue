<template>
  <div v-if="model">
    <component
      :is="tag"
      ref="form"
      :action="actionUrl"
      :method="method"
      :inline="inline"
      :label-position="inline ? 'left' : 'top'"
      label-width="50"
      @submit.native.prevent="handleSubmit"
      enctype="multipart/form-data"
      :model="value"
    >
      <input type="hidden" name="token" :value="auth.token">
      <b-tabs
        class="my-3"
        v-if="groupBy"
        :class="{'hide-group-name': _.get(layout, 'hideGroupName')}"
      >
        <b-tab-pane
          v-for="(subFields, tabName) in groupedFields"
          :label="_.get(layout, `tabs.${tabName}.name`) || tabName || $t('messages.default')"
          :key="tabName"
        >
          <b-row class="row form-cols">
            <b-col :span="_.get(layout, `tabs.${tabName}.cols`, 12) * 2">
              <b-row :gutter="20">
                <b-col
                  :span="getSpan(field)"
                  v-for="(field, name) in subFields"
                  :key="id + '_' +name"
                >
                  <b-form-item
                    v-if="isShowField(field) && model"
                    :state="!hasError(name)"
                    v-bind="field"
                    :label-for="'input_' + name"
                    :label="field.label !== false ? (field.label || $inflection.titleize(name)) : ''"
                  >
                    <b-form-field
                      :languages="languages"
                      :class="getInputClass(field)"
                      :parent="model"
                      @input="setValue(name, arguments[0], arguments[1])"
                      :value="model[name]"
                      :name="name"
                      :field="field"
                      :state="!hasError(name)"
                      :id="'input_' + name"
                    />
                  </b-form-item>
                </b-col>
              </b-row>
            </b-col>
            <b-col
              :md="24 - _.get(layout, `tabs.${tabName}.cols`, 0) * 2"
              v-if="!!_.get(layout, `tabs.${tabName}.right`)"
            >
              <div v-html="_.get(layout, `tabs.${tabName}.right`)"></div>
            </b-col>
          </b-row>
        </b-tab-pane>
      </b-tabs>
      <div class="row" v-else>
        <template v-for="(field, name) in fields">
          <b-form-item
            :span="getSpan(field)"
            v-if="isShowField(field) && model"
            :state="!hasError(name)"
            :key="[id,subForm,name].join()"
            v-bind="field"
            :label-for="getFieldId(name)"
            :label="field.label !== false ? (field.label || $inflection.titleize(name)) : ''"
          >
            <b-form-field
              :languages="languages"
              :class="getInputClass(field)"
              :parent="model"
              @input="setValue(name, arguments[0], arguments[1])"
              :value="model[name]"
              :name="getFieldName(name)"
              :field="field"
              :state="!hasError(name)"
              :id="getFieldId(name)"
            ></b-form-field>
          </b-form-item>
        </template>
      </div>

      <slot name="actions" v-if="!subForm">
        <b-button native-type="submit" type="primary" class="mr-1" ref="submitButton">{{submitText}}</b-button>
        <b-button @click="$router.go(-1)" v-if="backText">{{backText}}</b-button>
      </slot>
    </component>
  </div>
</template>

<script>
import _ from "lodash";

export default {
  name: "b-form-builder",
  components: {},
  props: {
    subForm: {
      type: String,
      default: ""
    },
    id: {
      type: String,
      default() {
        return "form_" + parseInt(Math.random() * 9999);
      }
    },
    auth: {
      type: Object,
      default() {
        return {};
      }
    },
    col: {
      type: Number,
      default: 12
    },
    languages: {},
    inline: {
      type: Boolean,
      default: false
    },
    useFormData: {
      type: Boolean,
      default: false
    },
    submitRawForm: {
      type: Boolean,
      default: false
    },
    groupBy: {
      type: String,
      default: null
    },
    value: {
      type: Object,
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
    layout: {
      required: false,
      default() {
        return {};
      }
    },
    onSubmit: {
      type: Function,
      required: false
    },
    beforeSubmit: {
      type: Function,
      required: false
    },
    action: {},
    method: {
      default: "post"
    },
    submitText: {
      default() {
        return this.$t ? this.$t("actions.save") : "Submit";
      }
    },
    backText: {
      default() {
        return this.$t ? this.$t("actions.back") : "Back";
      }
    },

    successMessage: {
      default() {
        return this.$t ? this.$t("messages.succeed") : "Succeed";
      }
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
      this.model = Object.assign({}, val);
    }
  },
  computed: {
    tag() {
      return this.subForm ? "div" : "b-form";
    },
    actionUrl() {
      return global.API_URI + this.action;
    },
    groupedFields() {
      const ret = {};
      _.keys(_.groupBy(this.fields, this.groupBy)).map(v => {
        let tabName = v;
        if (v === "undefined") {
          v = null;
          tabName = this.$t("messages.default");
        }
        ret[tabName] = _.pickBy(this.fields, field => field.group == v);
      });
      return ret;
    }
  },
  methods: {
    getFieldId(name) {
      if (this.subForm) {
        return `input_${this.subForm}_${name}`;
      }
      return `input_${name}`;
    },
    getFieldName(name) {
      if (this.subForm) {
        return `${this.subForm}[${name}]`;
      }
      return name;
    },
    setValue(name, value, lang) {
      const isIntl = this.fields[name].multilingual || this.fields[name].intl;
      if (!isIntl) {
        this.$set(this.model, name, value);
        // _.set(this.model, name, value);
      } else if (lang && !_.isObject(this.model[name])) {
        this.$set(this.model, name, {});
      } else {
        this.$set(this.model[name], lang, value);
      }
      return this.$emit("input", this.model);
    },
    titlize() {},
    isShowField(field) {
      return (
        !field.showWhen || this.model[field.showWhen] || eval(field.showWhen)
      );
    },
    getInputClass() {
      return [];
      // const classNames = [];
      // classNames.push(`col-lg-${field.input_cols ? field.input_cols : "12"}`);
      // return classNames;
    },
    getSpan(field) {
      const cols = field.cols ? field.cols : 12;
      return cols * 2;
    },
    getClass(field) {
      const cols = field.cols ? field.cols : 12;
      const classNames = ["col-lg-" + cols, "col-" + Math.min(12, cols * 2)];
      return classNames;
    },
    hasError(name) {
      return _.find(this.errors, v => v.field == name);
    },
    submitForm() {
      this.handleSubmit();
      // this.$refs.submitButton.click();
    },
    handleSubmit() {
      if (this.beforeSubmit) {
        const ret = this.beforeSubmit(this.model);
        if (ret === false) {
          return false;
        }
      }
      if (this.submitRawForm) {
        this.$refs.form.submit();
        return true;
      }
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
            this.$message({ type: "success", message: this.successMessage });
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
    this.model = Object.assign({}, this.value);

    for (let [k, v] of Object.entries(this.fields)) {
      if (v.type === "object" && !this.model[k]) {
        this.$set(this.model, k, {});
      }
    }
    // global.console.log(this.fields, this.model)
  },
  created() {}
};
</script>

