<template>
  <div class="p-3">
    <div class="text-center top">
      <a :href="site.url" target="_blank" v-if="site.logo">
        <b-img class="site-logo" :src="site.logo" fluid/>
      </a>
      <!-- <b-img class="site-logo" :src="require('../assets/img/gengyi-logo.svg')" fluid style="border-radius: 5px;" /> -->
      <!-- <b-img rounded="circle" :src="auth.user.avatar" height="70" blank-color="#777" alt="avatar" class="m-2" /> -->
      <div class="my-3" v-if="site.sidebar_userinfo !== false">
        <h5 style="letter-spacing:2px">{{site.name}}</h5>
        <template v-if="auth.user">
          <b-badge class="text-uppercase mr-1" v-if="auth.user.badge">{{auth.user.badge}}</b-badge>
          <span>{{auth.user.username}}</span>
        </template>
      </div>
      <div v-else></div>

      <locale-switcher></locale-switcher>
      <theme-switcher></theme-switcher>
    </div>
    <div slot="header"></div>
    <b-nav pills class="sidebar-nav" vertical>
      <template v-for="(item, index) in site.menu">
        <b-nav-text v-if="item.title" :key="index">
          <b>{{item.name}}</b>
        </b-nav-text>
        <b-nav vertical v-else-if="item.children" :key="index">
          <b-nav-item :to="child.url" :key="child.name" v-for="child in item.children">
            <i class="mr-1" :class="child.icon"></i>
            {{child.name}}
            <b-badge v-bind="child.badge" v-if="child.badge">{{child.badge.text}}</b-badge>
          </b-nav-item>
        </b-nav>
        <b-nav-item :active="$route.path === item.url" :to="item.url" v-else :key="index">
          <i class="mr-2" :class="item.icon"></i>
          {{item.name}}
          <b-badge v-bind="item.badge" v-if="item.badge">{{item.badge.text}}</b-badge>
        </b-nav-item>
      </template>
      <slot></slot>
    </b-nav>
    <p></p>
  </div>
</template>
<script>
import ThemeSwitcher from "./ThemeSwitcher";
import LocaleSwitcher from "./LocaleSwitcher";

import { mapState } from "vuex";
export default {
  name: "sidebar",

  computed: {
    ...mapState(["auth", "site"]),
    menu() {
      const menu = [];
      const titleIndices = [];
      this.site.menu.forEach((v, k) => {
        v.title && titleIndices.push(parseInt(k));
      });
      for (let i in titleIndices) {
        menu.push({
          name: this.site.menu[titleIndices[i]].name,
          children: this.site.menu.slice(titleIndices[i] + 1, titleIndices[parseInt(i) + 1])
        });
      }
      return menu;
    }
  },
  components: { LocaleSwitcher, ThemeSwitcher },
  methods: {
    toggle(item) {
      this.$set(item, "open", !item.open);
    }
  }
};
</script>

<style lang="scss">
.sidebar-nav .nav-item a{
  color:#333;
}
.sidebar-nav .nav-item:hover{
  background:#f6f6f6;
}
// .sidebar {
//   z-index: 999;
//   box-shadow: 1px 0 20px rgba(0, 0, 0, 0.1);
//   width: 200px;
//   height: 100vh;
//   overflow: auto;
//   letter-spacing: 1px;
//   padding: 1rem;

//   .site-logo {
//     // border-radius: 1rem;
//     // min-height:3em;
//   }

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
