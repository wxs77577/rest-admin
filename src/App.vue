<template>
  
  <div id="app" class="app">
    <b-header/>
    <div class="app-body">
      <b-sidebar :nav-items="nav.items"/>
      <main class="main">
        <!-- <breadcrumb :list="list"/> -->
        <div class="container-fluid">
          <router-view />
        </div>
      </main>
      
    </div>
    <b-footer/>
    <notifications />
  </div>
</template>

<script>
import Vue from 'vue'
import BHeader from './components/Header'
import BSidebar from './components/Sidebar'
import BFooter from './components/Footer'
import Switch from './components/Switch.vue'

import nav from './nav'

Vue.component('b-switch', Switch)

export default {
  name: 'app',
  components: {
    BHeader, BSidebar, BFooter
  },
  data() {
    return {
      nav: nav
    }
  }
}
</script>

<style>

</style>
