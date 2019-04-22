<template>
  <b-select :value="value" @input="$emit('input', arguments[0])" 
  :style="{width: field.width || 'auto'}" v-bind="field">
    <b-option
      v-for="item in field.options"
      :key="item.value"
      :label="item.text"
      :value="item.value"
    ></b-option>
  </b-select>
</template>

<script>
export default {
  props: {
    field: {},
    value: {},
  }
};
</script>

<style>
</style>
