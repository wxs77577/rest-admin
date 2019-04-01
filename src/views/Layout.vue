<template>
  <b-container class="app">
    <!-- <b-header></b-header> -->
    <app-sidebar/>

    <b-main class="main">
      <ol class="breadcrumb" v-if="false">
        <li class="breadcrumb-item" :key="index" v-for="(item, index) in path">
          <span class="active" v-if="isLast(index)">{{ item }}</span>
          <router-link :to="item" v-else>{{ item }}</router-link>
        </li>
      </ol>
      <div class="page-container pt-3 container-fluid">
        <custom-component :config="$store.state.site.header"></custom-component>
        <div class="px-2">
          <div
            class="page-header h2"
            v-if="$store.state.site.page_header"
            v-html="$store.state.site.page_header"
          ></div>
          <div class="page-body">
            <router-view class="animated fadeIn"/>
          </div>
        </div>
      </div>

      <app-footer v-if="$store.state.site.footer"></app-footer>
    </b-main>
    
    <!-- <b-file-manager></b-file-manager> -->
  </b-container>
</template>

<script>
import AppHeader from "../components/Header";
import AppSidebar from "../components/Sidebar";
import AppFooter from "../components/Footer";
// import BFileManager from "../components/FileManager";

export default {
  components: {
    AppHeader,
    AppSidebar,
    AppFooter
    // BFileManager
  },
  computed: {},
  data() {
    return {
      path: [],
      header: ""
    };
  },
  watch: {},
  created() {}
};
</script>

<style>

</style>
