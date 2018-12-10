<template>
  <div class="app">
    <!-- <b-header></b-header> -->
    
    <div class="app-body">
      <b-sidebar/>
      
        <main class="main">
          <b-loading :active="$store.state.loading" spinner="bar-fade-scale" style="height:100vh;"/>
          <ol class="breadcrumb" v-if="false">
            <li class="breadcrumb-item" :key="index" v-for="(item, index) in path">
              <span class="active" v-if="isLast(index)">{{ item }}</span>
              <router-link :to="item" v-else>{{ item }}</router-link>
            </li>
          </ol>
          <div class="page-container pt-4 container-fluid">
            <custom-component :config="$store.state.site.header"></custom-component>
            <div class="card1 ">
              <div
                class="page-header h2 pb-2"
                v-if="$store.state.site.page_header"
              >{{$store.state.site.page_header}}</div>
              <div class="page-body ">
                <router-view class="animated fadeIn"/>
              </div>
            </div>

            
          </div>
            
        </main>
        
      
    </div>
    <b-footer v-if="$store.state.site.footer"/>
    <!-- <b-file-manager></b-file-manager> -->
  </div>
</template>

<script>
import BHeader from "../components/Header";
import BSidebar from "../components/Sidebar";
import BFooter from "../components/Footer";
// import BFileManager from "../components/FileManager";

export default {
  components: {
    BHeader,
    BSidebar,
    BFooter
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

main.main{
  margin-left:200px;
  padding-bottom: 2em;
}
</style>
