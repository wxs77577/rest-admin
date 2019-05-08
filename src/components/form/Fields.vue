<template>
  <div>
    <el-form-item :prop="name" :error="get(errors, [name, 'message'], null)" v-for="(field, name) in fields" :label="field.label || name" :key="name">
      <el-field
        :name="name"
        :field="field"
        :parent="parent"
        :value="get(value, name)"
        @input="update(name, arguments[0])"
      ></el-field>
    </el-form-item>
    <slot></slot>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { get, set } from "lodash";
export default {
  name: "el-fields",
  components: {},
  props: {
    value: {},
    fields: {},
    parent: {},
    errors: {},
  },
  computed: {
    ...mapState(['site']),
    ...mapGetters(["authHeaders", "currentLanguage"])
  },
  methods: {
    get: get,
    getValue() {
      return Object.assign({}, this.value);
    },
    update(key, val) {
      const value = this.getValue();
      set(value, key, val);
      this.$emit("input", value, this.currentLanguage);
    },
    getIsIntl(field) {
      if (["select", "select2"].includes(field.type)) {
        return false;
      }
      return field.intl || field.multilingual;
    }
  }
};
</script>

