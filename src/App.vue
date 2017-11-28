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
  methods: {
    fetch(){
      this.$http.get('site').then(({data}) => {
        window.document.title = (data.name || 'REST ADMIN') + ' DASHBOARD'
        this.$store.commit(types.SET_SITE, data)
      })
    }
  },
  created() {
    this.fetch()
  }
};
</script>

<style>

</style>
