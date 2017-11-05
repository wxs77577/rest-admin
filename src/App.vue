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
  </div>
</template>

<script>

import BHeader from './components/Header'
import BSidebar from './components/Sidebar'
import BFooter from './components/Footer'

import nav from './nav'

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
