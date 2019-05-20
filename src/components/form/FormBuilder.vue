<template>
  <!-- <el-form v-if="useFormData" v-bind="$props" ref="form" >
    <el-fields :fields="fields" :value="value" @input="$emit('input', arguments[0])"></el-fields>
    <el-button native-type="submit" type="primary">{{submitText}}</el-button>
    <el-button v-if="backText">{{backText}}</el-button>
  </el-form>-->
  <el-form v-bind="$props" :model="value" ref="form" @submit.native.prevent="submit">
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
    useFormData: {
      type: Boolean
    },
    backText: {}
  },
  methods: {
    async submit() {
      let value = this.value;
      if (this.useFormData) {
        const fd = new FormData();
        for (let k in this.value) {
          fd.append(k, this.value[k])
        }
        value = fd;
      }
      const method = String(this.method).toLowerCase();
      const { data } = await this.$http[method](this.action, value);
      this.$emit("success", data);
    }
  }
};
</script>
