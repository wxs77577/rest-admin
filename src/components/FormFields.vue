<template>
  <div>
    <b-form-item v-for="(field, name) in fields" :label="field.label" :key="name">
      
      <b-select-field v-bind="field" v-if="['select', 'select2'].includes(field.type)" :value="value[name]" @input="$emit('input', name, arguments[0])"></b-select-field>
      
      <b-input v-else :value="value[name]" @input="$emit('input', name, arguments[0])"></b-input>
    </b-form-item>
  </div>
</template>

<script>
import BSelectField from './fields/SelectField'
export default {
  components: {
    BSelectField
  },
  props: {
    value: {},
    fields: {}
  }
};
</script>

