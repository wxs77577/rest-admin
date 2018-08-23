<template>
  <div class="card">
    <div class="card-header" v-if="data.header">{{data.header || data.title}}</div>
    <div class="card-body custom-page" :class="{nopadding: data.nopadding}" >
      <component :is="name" v-if="name"></component>
    </div>
  </div>
</template>
<style>
.nopadding {
  padding: 0 !important;
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
      name: null,
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
    async fetchPage() {
      // this.$refs.out.innerHTML = "";
      // new Vue(this.page).$mount(this.$refs.out, true);
      this.loaded = false
      this.name = 'page-' + (new Date()).getTime().toString()
      Vue.component(this.name, (resolve, reject) => {
        this.$http
          .get(this.uri)
          .then(({ data }) => {
            const rawData = Object.assign({}, data.data)
            data.data = () => rawData
            data.methods = _.mapValues(data.methods, v => new Function(...v));
            data.computed = _.mapValues(data.computed, v => new Function(...v));
            
            this.page = Object.assign({}, data, {
              data: rawData
            });
            this.loaded = true
            return resolve(data);
          })
          .catch(err => {
            return reject(err);
          });
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

