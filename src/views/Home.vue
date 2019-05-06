<template>
  <div class>
    <b-row :gutter="20">
      <b-col :span="6" v-for="(item, index) in data.statics" :key="index">
        <b-card class="text-white" :class="[`bg-${item.bg}`]">
          <div class="h1 text-right mb-4">
            <i :class="[item.icon]"></i>
          </div>
          <div class="h4 mb-0">{{item.value}}</div>
          <small class="text-uppercase font-weight-bold">{{item.title}}</small>
          <!-- <b-progress class=" mt-3" :percentage="item.progress" text-inside :stroke-width="10" :show-text="false"	/> -->
        </b-card>
      </b-col>
      <!--/.col-->
    </b-row>
    <!--/.row-->
    <div class="mt-5 text-center">
      <div class="display-4" style="font-size:3rem;" v-html="data.title"></div>
      <div class="py-4" v-html="data.description"></div>
      <b-button type="primary" v-bind="data.button" v-if="data.button" @click="$router.push(data.button.to)">
        <i :class="[data.button.icon]" v-if="data.button.icon"></i>
        {{data.button.text}}
      </b-button>
    </div>

    <div v-if="data.html" v-html="data.html"></div>
  </div>
</template>

<script>
import { types } from '../store';
export default {
  data() {
    return {
      data: {},
      html: ""
    };
  },
  methods: {
    fetch() {
      this.$http.get("home").then(({ data }) => {
        this.data = data;
      });
    }
  },
  created() {
    this.fetch();
  }
};
</script>
