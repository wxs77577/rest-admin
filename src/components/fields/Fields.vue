<template>
  <div>
    <el-form-item v-for="(field, name) in fields" :label="field.label || name" :key="name">
      <el-field :name="name" :field="field" :value="get(value, name)" @input="update(name, arguments[0])"></el-field>
    </el-form-item>
    <slot></slot>
  </div>
</template>

<script>

import { get, set } from "lodash";
export default {
  name: "el-fields",
  components: {
  },
  props: {
    value: {},
    fields: {}
  },
  computed: {
    
  },
  methods: {
    get: get,
    getValue() {
      return Object.assign({}, this.value);
    },
    update(key, val) {
      const value = this.getValue();
      set(value, key, val);
      this.$emit("input", value);
    }
  }
};
</script>

