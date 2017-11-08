<template>
  
  <div class="app">
    <b-header/>
    <div class="app-body">
      <b-sidebar :nav-items="$nav.items"/>
      <main class="main">
        <ol class="breadcrumb" v-if="false">
          <li class="breadcrumb-item" :key="index" v-for="(item, index) in path">
            <span class="active" v-if="isLast(index)">{{ item }}</span>
            <router-link :to="item" v-else>{{ item }}</router-link>
          </li>
        </ol>
        <div class="container-fluid">
          <router-view />
        </div>
      </main>
      
    </div>
    <b-footer/>
    <!-- <notifications /> -->
    <vue-snotify />
  </div>
</template>

<script>
import Vue from 'vue'
import BHeader from './Header'
import BSidebar from './Sidebar'
import BFooter from './Footer'


export default {
  components: {
    BHeader, BSidebar, BFooter
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
