<template>
  <b-container class="app" style="height:100vh;">
    <!-- <b-header></b-header> -->
    <b-aside class="border-right" style="width:200px;">
      <app-sidebar/>
    </b-aside>

    <b-main class="main">
      <div class="page-container container-fluid">
        <custom-component :config="$store.state.site.header"></custom-component>
        <h2
          class="page-header"
          v-if="$store.state.site.page_header"
          v-html="$store.state.site.page_header"
        ></h2>
        <router-view class="animated fadeIn"/>
      </div>

      <el-footer class="">
        <app-footer v-if="$store.state.site.footer"></app-footer>
      </el-footer>
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
  name: "layout",
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
