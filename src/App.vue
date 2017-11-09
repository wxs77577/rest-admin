<template>
  
  <div id="app">
    <router-view></router-view>
    <vue-snotify />
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  name: 'app',
  components: {
    
  },
  data() {
    return {
      path: []
    }
  }
}
</script>

<style>

</style>
