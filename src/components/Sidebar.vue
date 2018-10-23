<template>
  <div class="sidebar">
    <div class="text-center p-0 top" >
      <a :href="site.url" target="_blank">
        <b-img class="site-logo" :src="site.logo" fluid style="border-radius: 5px;" />
      </a>
      <!-- <b-img class="site-logo" :src="require('../assets/img/gengyi-logo.svg')" fluid style="border-radius: 5px;" /> -->
      
      <!-- <b-img rounded="circle" :src="auth.user.avatar" height="70" blank-color="#777" alt="avatar" class="m-2" /> -->
      <div class="my-3" v-if="site.sidebar_userinfo !== false">
        <h5 style="letter-spacing:2px">{{site.name}}</h5>
        <template v-if="auth.user">
          <b-badge class="text-uppercase mr-1" v-if="auth.user.badge">
            {{auth.user.badge}}
          </b-badge> 
          <span>{{auth.user.username}}</span>
        </template>
      </div>
      <div v-else></div>
      <languages />
      <!-- <theme-switcher /> -->

    </div>
    <nav class="sidebar-nav">
      <div slot="header"></div>
      <ul class="nav">
        <template v-for="(item, index) in site.menu">
          <li class="nav-title" v-if="item.title" :key="index">
            {{item.name}}
          </li>
          <li class="devider" v-else-if="item.divider" :key="index"> </li>

          <li class="nav-item nav-dropdown" :class="{open: item.open}" v-else-if="item.children" :key="index">
            <div class="nav-link nav-dropdown-toggle" @click="toggle(item)">
              <i :class="item.icon"></i> {{item.name}}
              <b-badge v-bind="item.badge" v-if="item.badge">{{item.badge.text}}</b-badge>
            </div>
            <ul class="nav-dropdown-items">
              <li class="nav-item" v-for="child in item.children" :key="child.name">
                <div>
                  <router-link :exact="item.exact" :to="child.url" class="nav-link" active-class="active">
                    <i :class="child.icon"></i> {{child.name}}
                    <b-badge v-bind="child.badge" v-if="child.badge">{{child.badge.text}}</b-badge>

                  </router-link>
                </div>
              </li>
            </ul>
          </li>
          <li class="nav-item" v-else :key="index">
            <div>
              <router-link :exact="item.exact" :to="item.url" class="nav-link" active-class="active">
                <i :class="item.icon"></i> {{item.name}}
                <b-badge v-bind="item.badge" v-if="item.badge">{{item.badge.text}}</b-badge>
              </router-link>
            </div>
          </li>
        </template>
      </ul>
      <slot></slot>
    </nav>
    <p></p>

  </div>
</template>
<script>
// import ThemeSwitcher from "./ThemeSwitcher";
import Languages from "./Languages";

import { mapState } from "vuex";
export default {
  name: "sidebar",

  computed: {
    ...mapState(["auth", "site"])
  },
  components: { Languages },
  methods: {
    toggle(item) {
      this.$set(item, "open", !item.open);
    }
  }
};
</script>

<style lang="scss">
.sidebar {
  box-shadow: 0 0 20px #000;
  .top {
    // position: sticky;
  }
  .site-logo {
    // background: #fff;
    /* padding:1em; */
  }
}
</style>
