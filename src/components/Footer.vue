<template>
  <div class="app-footer text-right py-3" style="font-size:0.85rem;">
    <footer class="text-center"  v-html="site.footer" v-if="site.footer"></footer>
    <footer v-else class="text-center">
      <span class="ml-auto1">
        GitHub
        <a href="https://github.com/wxs77577/rest-admin">REST-ADMIN</a>
      </span>
    </footer>
  </div>
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
    text-align: right;
  }
}
</style>
