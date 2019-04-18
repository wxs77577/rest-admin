<template>
  <div>
    
    <b-row>
      <b-col md="4" lg="3" xl="2">
        <b-sidebar/>
      </b-col>
      <b-col xl="10">
        <main class="pt-3">
          <b-loading
            :active="$store.state.loading && $store.state.site.enable_loading"
            spinner="bar-fade-scale"
            style="height:100vh;"
          />
          <ol class="breadcrumb" v-if="false">
            <li class="breadcrumb-item" :key="index" v-for="(item, index) in path">
              <span class="active" v-if="isLast(index)">{{ item }}</span>
              <router-link :to="item" v-else>{{ item }}</router-link>
            </li>
          </ol>
          <div class="">
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
          <b-footer v-if="$store.state.site.footer"/>
        </main>
      </b-col>
    </b-row>

    <!-- <b-file-manager></b-file-manager> -->
  </div>
</template>

<script>
import BHeader from "../components/Header";
import BSidebar from "../components/Sidebar";
import BFooter from "../components/Footer";
import { mapState } from "vuex";
// import BFileManager from "../components/FileManager";

export default {
  components: {
    BHeader,
    BSidebar,
    BFooter
    // BFileManager
  },
  computed: {
    ...mapState(["site"]),
    
  },
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
/* main.main {
  margin-left: 200px;
  padding-bottom: 2em;
} */
</style>
