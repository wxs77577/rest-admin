<template>
  <div id="app">
    <router-view></router-view>
    <vue-snotify />
    <iframe :src="$store.state.downloadUrl" style="width:0;height:0;border:none;"></iframe>
    <div v-html="$store.state.site.html"></div>
    

  </div>
</template>

<script>
import { types } from "./store";

export default {
  name: "app",
  components: {},
  data() {
    return {
      frameSrc: '',
      path: []
    };
  },
  watch: {
    "$store.state.site.name"(name) { 
      window.document.title = name || "REST ADMIN DASHBOARD"
    }
  },
  methods: {
    
  },
  created() {
    this.$store.dispatch(types.FETCH_SITE)
  }
};
</script>

<style>
body{
  /* background: darkgrey !important; */
}
#app{
  /* background:#fff; */
  /* width:1200px; */
  /* margin:0 auto; */
  /* box-shadow:0 0 30px #333; */
}

</style>
