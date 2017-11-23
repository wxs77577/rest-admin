<template>
  <div class="">
    <div class="row">
      <div class="col-sm-6  col-md-3 " v-for="(item, index) in statics" :key="index">
        <b-card class="text-white" :class="[`bg-${item.bg}`]">
          <div class="h1 text-muted text-right mb-4">
            <i :class="[item.icon]"></i>
          </div>
          <div class="h4 mb-0">{{item.value}}</div>
          <small class="text-muted text-uppercase font-weight-bold">{{item.title}}</small>
          <b-progress class="progress-white progress-xs mt-3" :value="item.progress"/>
        </b-card>
      </div><!--/.col-->
      
    </div><!--/.row-->
  </div>
</template>

<script>
export default {
  data(){
    return {
      statics: []
    }
  },
  methods: {
    fetch(){
      this.$http.get('home').then(({data}) => {
        this.statics = data.statics
      })
    }
  },
  created() {
    this.fetch()
  }
}
</script>
