<template>
  <div class="m-4" v-if="$store.state.site.theme_switcher">
    <b-select :options="themeOptions" v-model="theme"></b-select>
  </div>
</template>

<script>
import types from "../store/types.js";

export default {
  data() {
    return {
      theme: this.$store.state.site.theme,
      themeOptions: `
      cerulean  darkly    litera    materia   sandstone slate     superhero
      cosmo     flatly    lumen     minty     simplex   solar     united
      cyborg    journal   lux       pulse     sketchy   spacelab  yeti
      `.split(/\s+/)
    };
  },
  watch: {
    theme(val) {
      if (val) {
        this.$store.commit(types.SET_THEME, val);
      }
    }
  },
  created() {
    this.theme = this.$storage.get("theme");
  }
};
</script>

