<template>
  <div  class="m-4">
    <b-select :options="themeOptions" v-model="theme" placeholder="Choose a Theme"></b-select>
  </div>
</template>

<script>
import types from '../store/types.js'

export default {
  data(){
    return {
      theme: 'null',
      themeOptions: `
      cerulean  darkly    litera    materia   sandstone slate     superhero
      cosmo     flatly    lumen     minty     simplex   solar     united
      cyborg    journal   lux       pulse     sketchy   spacelab  yeti
      `.split(/\s+/)
    }
  },
  watch: {
    theme(val){
      if (val) {
        this.$store.commit(types.SET_THEME, val)
      }
    }
  },
  created(){
    this.theme = this.$storage.get('theme') || 'lumen'
  }
}
</script>

