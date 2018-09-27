<template>
  <component :is="page" v-if="page"></component>
</template>
<style>
.nopadding {
  padding: 0 !important;
}
</style>
<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      loaded: false,
      name: null,
      page: false
    };
  },

  computed: {
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
    async fetchPage() {
      // this.$refs.out.innerHTML = "";
      // new Vue(this.page).$mount(this.$refs.out, true);
      this.loaded = false;
      this.name = "page-" + new Date().getTime().toString();
      // Vue.component(this.name, (resolve, reject) => {
      this.$http.get(this.uri).then(({ data }) => {
        const rawData = Object.assign({}, data.data);
        data.data = () => rawData;
        data.name = "custom-page-" + new Date().getTime();
        const wrapFunction = v => new Function(...v);
        const mapValues = (obj = {}) => {
          return Object.entries(obj).reduce((acc, [k, v]) => {
            acc[k] = wrapFunction(v);
            return acc;
          }, {});
        };

        data.methods = mapValues(data.methods, wrapFunction);
        data.computed = mapValues(data.computed, wrapFunction);
        data.created = data.created ? wrapFunction(data.created) : null;
        data.mounted = data.mounted ? wrapFunction(data.mounted) : null;
        data.watch = data.watch ? wrapFunction(data.watch) : null;

        this.page = Object.assign({}, data, {});
        this.loaded = true;
      });
      // });
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

