<template>
  
  <div id="app">
    <router-view></router-view>
    <vue-snotify />
  </div>
</template>

<script>
import Vue from "vue";
import { types } from "./store";

export default {
  name: "app",
  components: {},
  data() {
    return {
      path: []
    };
  },
  watch: {
    "$store.state.site.name"(name) { 
      window.document.title = name || "REST ADMIN DASHBOARD"
    }
  },
  methods: {},
  created() {
    this.$store.dispatch(types.FETCH_SITE)
  }
};
</script>

<style>

</style>
