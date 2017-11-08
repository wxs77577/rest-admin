<template>
  <v-select :value="value" @input="setSelectedValue(arguments[0], key)" />
</template>

<script>
import Vue from "vue";
import vSelect from 'vue-select'

export default {
  components: {
    vSelect
  },
  props: {
    id: {},
    value: {
      default() {
        return ''
      }
    },
    options: {}
  },
  computed: {},
  data() {
    return {
    };
  },
  methods: {
    setSelectedValue(value, key) {

    }

  },
  mounted() {
    this.options.forEach((v, k) => {
      if (k === this.value) {
        this.value = v
      }
    })
  },
  created() {

  }
};
</script>

<style>

</style>
