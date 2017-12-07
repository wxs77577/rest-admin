<template>
  <footer class="app-footer" v-html="site.footer" v-if="site.footer"></footer>
  <footer class="app-footer" v-else>
    <!-- v-html="site.footer" -->
    <span><a :href="site.url">{{site.name}}</a> &copy; {{(new Date).getFullYear()}} </span>
    <span class="ml-auto">
      Powered by <a href="https://genyii.com">上海庚易软件科技有限公司</a>
    </span>
  </footer>
</template>
<script>
import {mapState} from 'vuex'
export default {
  name: "footer",
  computed: {
    ...mapState(['site'])
  }
};
</script>
