<template>
  <b-footer class="app-footer">
    <footer class="bg-light" v-html="site.footer" v-if="site.footer"></footer>
    <footer class="bg-light" v-else>
      <span class="ml-auto">
        GitHub
        <a href="https://github.com/wxs77577/rest-admin">REST-ADMIN</a>
      </span>
    </footer>
  </b-footer>
</template>
<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["site"])
  }
};
</script>
<style lang="scss">
.app-footer1 {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 100%;
  z-index: 9;
  letter-spacing: 1px;

  & > footer {
    margin-left: 215px;
    padding: 0.5em;
    text-align: right;
  }
}
</style>
