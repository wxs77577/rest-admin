<template>
  <select-field @input="$emit('input', arguments[0])" :value="value" :field="$props">
  </select-field>
</template>

<script>
import SelectField from './SelectField'
export default {
  components: {SelectField},
  props: ['options', 'name', 'value']
};
</script>

<style>
</style>
