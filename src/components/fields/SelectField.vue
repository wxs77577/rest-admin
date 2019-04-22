<template>
  <b-select :value="value" @input="$emit('input', arguments[0])">
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
    value: {},
    options: {},
  }
};
</script>

<style>
</style>
