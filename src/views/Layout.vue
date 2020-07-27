<template>
  <el-container>
    <el-aside width="200px">
      <el-menu router mode="vertical" :default-active="$route.path">
        <el-menu-item
          v-for="item in settings.menu"
          :key="item.url"
          :index="item.url"
        >
          {{ item.name }}
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header height="">
        <!-- Header content -->
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import $api from '../api'
export default {
  data() {
    return {
      settings: {
        menu: {
          items: []
        }
      }
    }
  },
  methods: {
    async getSettings(){
      this.settings = await $api.getSettings()
    }
  },
  created() {
    this.getSettings()
  },
}
</script>
