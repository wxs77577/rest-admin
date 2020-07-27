<template>
  <el-container>
    <el-aside width="200px">
      <el-menu router mode="vertical" :default-active="$route.path">
        <el-menu-item
          v-for="item in menu.items"
          :key="item.path"
          :index="item.path"
        >
          {{ item.text }}
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
export default {
  data() {
    return {
      menu: {
        items: [],
      },
    }
  },
  created() {
    this.menu.items = Object.entries({
      courses: "专栏",
      users: "用户",
      posts: "课程",
      groups: "班级",
      group_words: "班级文案",
    }).map(([path, text]) => ({ text, path: `/crud/${path}` }))
  },
}
</script>
