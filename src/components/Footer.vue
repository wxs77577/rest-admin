<template>
  <footer class="app-footer" v-html="site.footer" v-if="site.footer"></footer>
  <footer class="app-footer" v-else>
    <span class="ml-auto">GitHub
      <a href="https://github.com/wxs77577/rest-admin">REST-ADMIN</a>
    </span>
  </footer>
</template>
<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["site"])
  }
};
</script>
<style>
.app-footer {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 100%;
  z-index: 9;
  padding-left: 215px;
  letter-spacing: 1px;
  text-align: right;
  padding: 0.5em;
  background: #fff;
  color: #666;
}
</style>
