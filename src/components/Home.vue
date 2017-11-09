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
      statics: [
        {
          bg: 'info',
          icon: 'icon-speedometer',
          value: 97200,
          title: '访问量',
          progress: 78
        },
        {
          bg: 'success',
          icon: 'icon-people',
          value: 12532,
          title: '用户数',
          progress: 60
        },
        {
          bg: 'warning',
          icon: 'icon-basket-loaded',
          value: 8780,
          title: '销售额',
          progress: 92
        },
        {
          bg: 'primary',
          icon: 'icon-speech',
          value: 650,
          title: '语音数量',
          progress: 67
        },
      ]
    }
  },
  methods: {
    
  },
}
</script>
