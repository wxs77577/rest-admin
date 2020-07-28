<template>
  <div class="home">
    <avue-data-panel v-bind="config"></avue-data-panel>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Home",
  components: {},
  data() {
    return {
      config: {
        is: "avue-data-panel",
        option: {
          span: 6,
          data: [
            {
              title: "Users",
              count: 19000,
              icon: "el-icon-user",
              color: "#00a7d0",
            },
            {
              title: "Users",
              count: 19000,
              icon: "el-icon-user",
              color: "#00a7d0",
            },
            {
              title: "Users",
              count: 19000,
              icon: "el-icon-user",
              color: "#00a7d0",
            },
            {
              title: "Users",
              count: 19000,
              icon: "el-icon-user",
              color: "#00a7d0",
            },
          ],
        },
      },
    }
  },
}
</script>
