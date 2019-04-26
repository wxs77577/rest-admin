<template>
  <div class="py-2" v-if="site.locale_switcher">
    
    <el-radio-group v-model="model" size="mini">
      <el-radio-button :label="lang" :key="lang"
      v-for="lang in Object.keys($i18n.messages)"></el-radio-button>
    </el-radio-group>
  </div>
</template>

<script>
import types from "../store/types";
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["site"]),
    model: {
      get(){
        return this.site.locale
      },
      set(val){
        this.$store.commit(types.SET_LOCALE, val);
      }
    },
  },
  filters: {
    ucfirst(val) {
      return String(val)[0].toUpperCase() + String(val).slice(1);
    }
  }
};
</script>

