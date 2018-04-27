<template>
  <footer class="app-footer" v-html="site.footer" v-if="site.footer"></footer>
  <footer class="app-footer" v-else>
   <span><a href="https://github.com/wxs77577/rest-admin">REST-ADMIN</a> &copy; 2018</span>
    <span class="ml-auto">
      GitHub <a href="https://github.com/wxs77577/rest-admin">REST-ADMIN</a>
    </span>
  </footer>
</template>
<script>
import {mapState} from 'vuex'
export default {
  computed: {
    ...mapState(['site'])
  }
};
</script>
