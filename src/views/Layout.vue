<template>
  <el-container class="app" style="height:100vh;">
    <!-- <el-header></el-header> -->
    <el-aside class="scroller" :style="{width: collapse ? '3.5rem' : '12rem'}">
      <app-sidebar :dark="dark" :collapse="collapse"/>
    </el-aside>

    <el-container>
      <el-header class="main-header py-3 px-3" :class="{dark}">
        <el-row>
          <el-col :md="16">
            <span>&nbsp;</span>
            <!-- <h3 class="mr-2 mb-0">{{site.name}}</h3> -->
          </el-col>
          <el-col :md="8" class="text-right">
            <el-checkbox v-model="dark" label="夜间模式"></el-checkbox>
            <el-checkbox v-model="collapse" label="折叠"></el-checkbox>
            <locale-switcher v-if="site.locale_switcher || 1"></locale-switcher>
          </el-col>
        </el-row>
      </el-header>
      <el-main class="pt-2 scroller">
        <div class="page-container container-fluid">
          <custom-component :config="$store.state.site.header"></custom-component>
          <h2
            class="page-header"
            v-if="$store.state.site.page_header"
            v-html="$store.state.site.page_header"
          ></h2>
          <router-view class="animated fadeIn"/>
        </div>
      </el-main>
      <el-footer class="h-auto">
        <app-footer v-if="$store.state.site.footer"></app-footer>
      </el-footer>
    </el-container>

    <!-- <el-file-manager></el-file-manager> -->
  </el-container>
</template>

<script>
import AppHeader from "../components/Header";
import AppSidebar from "../components/Sidebar";
import AppFooter from "../components/Footer";

import LocaleSwitcher from "../components/LocaleSwitcher";
// import BFileManager from "../components/FileManager";

import { mapState } from "vuex";

export default {
  name: "layout",
  components: {
    AppHeader,
    AppSidebar,
    AppFooter,
    LocaleSwitcher
    // BFileManager
  },
  computed: {
    ...mapState(["site"])
  },
  data() {
    return {
      path: [],
      header: "",
      dark: false,
      collapse: false
    };
  },
  watch: {},
  created() {}
};
</script>

<style lang="scss">
body{
  overflow: hidden;
}
.app {
  overflow: hidden;
}
.el-container .el-container {
  overflow: hidden;
}
.main-header {
  background: #f0f3f5;
  &.dark {
    background-color: var(--dark-bg);
  }
}
.el-aside {
  overflow-x: hidden;
  overflow-y: scroll;
}

.scroller {
  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
  }

  &::-webkit-scrollbar {
    width: 4px;
    background-color: #aaa;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: #666;
  }
}
</style>
