<template>
  <div class="card">
    <div class="card-header" v-if="data.header">{{data.header || data.title}}</div>
    <div class="card-body custom-page" :class="{nopadding: data.nopadding}"  ref="out"></div>
  </div>
</template>
<style>
.nopadding{
  padding:0 !important;
}
</style>
<script>
import Vue from "vue";
import _ from "lodash";

export default {
  components: {},
  props: {},
  data() {
    return {
      loaded: false,
      page: {
        data: {}
      }
    };
  },

  computed: {
    data() {
      return this.page.data;
    },
    uri() {
      return this.$route.params.uri.replace(/\./g, "/");
    }
  },
  watch: {
    $route: "fetch"
  },
  methods: {
    fetch() {
      this.fetchPage();
    },
    render() {},
    fetchPage() {
      this.$http.get(this.uri).then(({ data }) => {
        data.methods = _.mapValues(data.methods, v => new Function(...v));
        data.computed = _.mapValues(data.computed, v => new Function(...v));
        this.page = data;
        this.$refs.out.innerHTML = "";
        new Vue(this.page).$mount(this.$refs.out, true);
      });
    },

    onSuccess(data) {
      const { message, then, redirect } = data;
      if (message) {
        this.$snotify.success(message);
      }
      if (then) {
        eval(then);
      } else if (redirect) {
        this.$router.push({ path: redirect });
      } else {
        this.$router.go(-1);
      }
    }
  },
  mounted() {},
  created() {
    this.fetchPage();
  }
};
</script>

