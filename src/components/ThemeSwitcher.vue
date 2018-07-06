<template>
  <div  class="my-2">
    <b-select :options="themeOptions" v-model="theme" placeholder="Choose a Theme"></b-select>
  </div>
</template>

<script>
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
      val && this.applyTheme(val)
    }
  },
  methods: {
    applyTheme(theme){
      import(`bootswatch/dist/${theme}/bootstrap.min.css`).then(() => {
        global.console.log('Theme "%s" is applied succeded.', this.theme)
      })
    }
  },
  created(){
    this.theme = 'lumen'
  }
}
</script>

