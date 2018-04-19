<template>
  <div class="py-2">
    <b-button size="sm" class="mr-1" @click="changeLocale(lang)" :key="lang"
      v-for="lang in Object.keys($i18n.messages)">{{lang | ucfirst}}</b-button>
  </div>
</template>

<script>
import types from '../store/types'

export default {
  filters: {
    ucfirst(val) {
      return String(val)[0].toUpperCase() + String(val).slice(1)
    }
  },
  methods: {
    changeLocale(locale){
      this.$store.commit(types.SET_LOCALE, locale)
    }
  }
}
</script>

