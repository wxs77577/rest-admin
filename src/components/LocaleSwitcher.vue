<template>
  <el-radio-group v-model="model" size="mini">
    <el-radio-button class="mb-0" :label="lang" :key="lang"
    v-for="lang in Object.keys($i18n.messages)"></el-radio-button>
  </el-radio-group>
</template>

<script>
import types from "../store/types";
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["i18n"]),
    model: {
      get(){
        return this.i18n.locale
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

