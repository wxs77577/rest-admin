<template>
  <el-form v-bind="$props" @submit.native.prevent="submit">
    <el-fields :fields="fields" :value="value" @input="$emit('input', arguments[0])"></el-fields>
    <el-button native-type="submit" type="primary">{{submitText}}</el-button>
    <el-button v-if="backText">{{backText}}</el-button>
  </el-form>
</template>

<script>
export default {
  props: {
    fields: {},
    action: {},
    method: {
      default: "post"
    },
    value: {},
    submitText: {},
    backText: {}
  },
  methods: {
    async submit() {
      const { data } = await this.$http[String(this.method).toLowerCase()](
        this.action,
        this.value
      );
      this.$emit('success', data)
    }
  }
};
</script>
