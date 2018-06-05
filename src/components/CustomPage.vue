<template>
  <b-card :header="page.header">
    <div class="custom-page">
      <h1>{{page.title}}</h1>
      <div ref="out">out</div>
    </div>
  </b-card>
</template>

<script>
import _ from 'lodash'
import { mapState, mapGetters } from "vuex";
import Vue from 'vue'

export default {
  components: {},
  props: {},
  data() {
    return {
      loaded: false,
      page: {}
    };
  },

  computed: {
    uri() {
      return this.$route.query.uri;
    }
  },
  methods: {
    fetch() {},
    render() {
      
    },
    fetchPage() {
      this.$http.get(this.uri).then(({ data }) => {
        this.page = data;
        new Vue(this.page).$mount(this.$refs.out)
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

