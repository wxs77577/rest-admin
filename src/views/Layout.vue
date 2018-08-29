<template>
  <div class="app">
    <!--  -->
    <div class="app-body1">
      <b-sidebar />
      <main class="main p-3">
        <b-loading :active="$store.state.loading" spinner="bar-fade-scale" style="height:100vh;"/>
        <ol class="breadcrumb" v-if="false">
          <li class="breadcrumb-item" :key="index" v-for="(item, index) in path">
            <span class="active" v-if="isLast(index)">{{ item }}</span>
            <router-link :to="item" v-else>{{ item }}</router-link>
          </li>
        </ol>
        <div class="container-fluid">
          <header v-if="$store.state.site.header" v-html="$store.state.site.header"></header>

          <router-view class="animated fadeIn" />
        </div>
      </main>

    </div>
    <b-footer/>

  </div>
</template>

<script>
import BHeader from "../components/Header";
import BSidebar from "../components/Sidebar";
import BFooter from "../components/Footer";

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
