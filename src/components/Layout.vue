<template>
  <div class="app">
    <!-- <b-header/> -->
    <div class="app-body1">
      <b-sidebar />
      <main class="main p-3">
        <ol class="breadcrumb" v-if="false">
          <li class="breadcrumb-item" :key="index" v-for="(item, index) in path">
            <span class="active" v-if="isLast(index)">{{ item }}</span>
            <router-link :to="item" v-else>{{ item }}</router-link>
          </li>
        </ol>
        <div class="container-fluid">
          <router-view class="animated fadeIn" />
        </div>
      </main>

    </div>
    <b-footer/>

  </div>
</template>

<script>
import Vue from "vue";
import BHeader from "./Header";
import BSidebar from "./Sidebar";
import BFooter from "./Footer";

import { mapState } from "vuex";

export default {
  components: {
    BHeader,
    BSidebar,
    BFooter
  },
  computed: {},
  data() {
    return {
      path: []
    };
  },
  created() {}
};
</script>

<style>

.sidebar-fixed .sidebar {
  height: 100%;
}
</style>
