<template>
  <el-select
    :value="value"
    @input="$emit('input', arguments[0])"
    v-bind="field"
    :remote="!!field.ajaxOptions"
    :remote-method="field.ajaxOptions ? fetchOptions : null"
  >
    <el-option v-for="item in options" :key="item.value" :label="item.text" :value="item.value"></el-option>
  </el-select>
</template>

<script>
import _ from "lodash";

export default {
  props: {
    field: {},
    value: {},
    parent: {}
  },
  data() {
    return {
      options: (this.field.options || []).slice(0)
    };
  },
  methods: {
    async fetchOptions() {
      let {
        url,
        depends,
        resource,
        text,
        where,
        value
      } = this.field.ajaxOptions;
      url = url || `${resource}/options`;

      const res = await this.$http.get(url, {
        params: {
          query: JSON.stringify({
            where,
            text,
            value,
            defaultValue: this.value
          })
        }
      });
      this.options = res.data;
    }
  },
  mounted() {
    this.field.ajaxOptions && this.fetchOptions();
  }
};
</script>

<style>
</style>
