<template>
  <div class="sidebar h-100" :class="{dark}">
    <div class="text-center" v-if="!collapse">
      <a class="p-3 d-block" :href="site.url" v-if="site.logo">
        <img class="site-logo w-100" :src="site.logo">
      </a>
      <div class="py-3" v-if="site.sidebar_userinfo !== false">
        <h5 style="letter-spacing:2px">{{site.name}}</h5>
        <template v-if="auth.user">
          <b-badge class="text-uppercase mr-1" v-if="auth.user.badge">{{auth.user.badge}}</b-badge>
          <span>{{auth.user.username}}</span>
        </template>
      </div>
      <div v-else></div>
    </div>
    <el-menu
      :collapse="collapse"
      :collapse-transition="false"
      router
      :show-timeout="100"
      class="border-right-0"
      :default-openeds="opened"
      :background-color="dark ? '#29363d' : '#fff'"
      :text-color="dark ? '#ddd' : '#000'"
      :active-text-color="dark ? '#20a8d8' : '#20a8d8'"
      unique-opened
    >
      <template v-for="(item, index) in menu">
        <el-submenu :index="item.name" :key="index" v-if="item.children">
          <template slot="title">
            <i :class="item.icon" class="mr-2" v-if="item.icon"></i>
            <span>{{item.name}}</span>
          </template>
          <el-menu-item :index="child.url" :key="i" v-for="(child, i) in item.children">
            <i class="mr-2" :class="child.icon" v-if="child.icon"></i>
            <span>{{child.name}}</span>
          </el-menu-item>
        </el-submenu>
        <el-menu-item :index="item.url" :key="index" v-else>
          <i class="mr-2" :class="item.icon" v-if="item.icon"></i>
          <span>{{item.name}}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>
<script>


import { mapState } from "vuex";
import { get } from "lodash";
export default {
  name: "sidebar",
  props: {
    dark: {},
    collapse: {}
  },
  computed: {
    ...mapState(["auth", "site"]),
    opened() {
      return [get(this.menu.find(v => v.children), "name")];
    },
    menu() {
      let i = 0;
      const ret = this.site.menu.reduce((arr, v) => {
        if (v.title) {
          i++;
          arr[i] = {
            name: v.name,
            icon: v.icon
          };
          return arr;
        } else {
          if (!arr[i] || !arr[i].name) {
            arr.push(v);
            return arr;
          }
        }
        !arr[i].children && (arr[i].children = []);
        arr[i].children.push(v);
        return arr;
      }, []);
      return ret;
    }
  },
  
  methods: {
    toggle(item) {
      this.$set(item, "open", !item.open);
    }
  }
};
</script>

<style lang="scss">
.sidebar {
  transition: background-color 0.3s;
  &.dark {
    background-color: var(--dark-bg);
    color: #f7f7f7;
  }
  .site-logo {
    box-shadow: 0 1px 20px rgba(0, 0, 0, 0.2);
  }
}
// .sidebar {
//   z-index: 999;
//   box-shadow: 1px 0 20px rgba(0, 0, 0, 0.1);
//   width: 200px;
//   height: 100vh;
//   overflow: auto;
//   letter-spacing: 1px;
//   padding: 1rem;

//   .nav-link {
//     color: #666;
//     display: flex;
//     align-items: center;
//     padding: 0.7rem 1rem;
//     // border-radius: 2rem;
//     // font-weight: 400;

//     &:hover,
//     &.active {
//       // color: #333;
//       // background: #eee;
//     }
//     i {
//       margin-right: 1rem;
//     }
//   }
//   .nav-title {
//     font-size: 0.7rem;
//     font-weight: bold;
//     text-transform: uppercase;
//     color: #ced4da;
//     padding: 1rem 1rem 0.5rem 0;
//   }
// }
</style>
