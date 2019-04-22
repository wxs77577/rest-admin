<template>
  <b-select v-if="['select', 'select2'].includes(field.type)" :value="value" @input="$emit('input', arguments[0])"></b-select>
  <b-input v-else :value="value" @input="$emit('input', arguments[0])"></b-input>
</template>

<script>
export default {
  props: {
    value: {},
    field: {},
  }
}
</script>

<style>

</style>
