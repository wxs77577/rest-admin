<template>
  <el-container class="app" style="height:100vh;" :class="{dark}">
    <!-- <el-header></el-header> -->
    <el-aside class="scroller" :class="{dark}" :style="{width: collapse ? '3.5rem' : '12rem'}">
      <app-sidebar :dark="dark" :collapse="collapse"/>
    </el-aside>

    <el-container class="layout-main">
      <el-header class="main-header py-2 px-3" height="auto" :class="{dark}">
        <el-row>
          <el-col :md="12">
            <span>&nbsp;</span>
            <!-- <h3 class="mr-2 mb-0">{{site.name}}</h3> -->
          </el-col>
          <el-col :md="12" class="text-right">
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
      dark: true,
      collapse: false
    };
  },
  methods: {
    bindStorage() {
      this.dark = this.$storage.get("dark", false);
      this.$watch("dark", val => this.$storage.set("dark", val));

      this.collapse = this.$storage.get("collapse", false);
      this.$watch("collapse", val => this.$storage.set("collapse", val));
    }
  },

  created() {
    this.bindStorage()
  }
};
</script>

<style lang="scss">
body {
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
    background-color: var(--dark);
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
    background-color: #eee;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: #aaa;
  }
  &.dark::-webkit-scrollbar {
    background-color: #555;
  }

  &.dark::-webkit-scrollbar-thumb {
    background-color: #000;
  }
}

</style>
