<template>
  <div class="sidebar position-fixed">
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
      
      <languages/>
      <theme-switcher />
    </div>
    <nav class="sidebar-nav">
      <hr class="mx-4">
      <div slot="header"></div>
      <ul class="nav flex-column">
        <template v-for="(item, index) in site.menu">
          <li class="nav-item" v-if="item.title" :key="index">
            <div class="nav-title">{{item.name}}</div>
          </li>
          <li class="devider" v-else-if="item.divider" :key="index"></li>

          <li
            class="nav-item nav-dropdown"
            :class="{open: item.open}"
            v-else-if="item.children"
            :key="index"
          >
            <div class="nav-link nav-dropdown-toggle" @click="toggle(item)">
              <i :class="item.icon"></i>
              {{item.name}}
              <b-badge v-bind="item.badge" v-if="item.badge">{{item.badge.text}}</b-badge>
            </div>
            <ul class="nav-dropdown-items">
              <li class="nav-item" v-for="child in item.children" :key="child.name">
                <div>
                  <component
                    :exact="child.exact"
                    :to="child.url"
                    :href="child.url"
                    :is="child.external?'a':'router-link'"
                    class="nav-link"
                    active-class="active"
                  >
                    <i :class="child.icon"></i>
                    {{child.name}}
                    <b-badge v-bind="child.badge" v-if="child.badge">{{child.badge.text}}</b-badge>
                  </component>
                </div>
              </li>
            </ul>
          </li>
          <li class="nav-item" v-else :key="index">
            <component
              :exact="item.exact"
              :to="item.url"
              :href="item.url"
              :is="item.external?'a':'router-link'"
              class="nav-link"
              active-class="active"
            >
              <i :class="item.icon"></i>
              {{item.name}}
              <b-badge v-bind="item.badge" v-if="item.badge">{{item.badge.text}}</b-badge>
            </component>
          </li>
        </template>
      </ul>
      <slot></slot>
    </nav>
    <p></p>
  </div>
</template>
<script>
import ThemeSwitcher from "./ThemeSwitcher";
import Languages from "./Languages";

import { mapState } from "vuex";
export default {
  name: "sidebar",

  computed: {
    ...mapState(["auth", "site"])
  },
  components: { Languages, ThemeSwitcher },
  methods: {
    toggle(item) {
      this.$set(item, "open", !item.open);
    }
  }
};
</script>

<style lang="scss">
.sidebar {
  z-index: 999;
  box-shadow: 1px 0 20px rgba(0, 0, 0, 0.1);
  width: 200px;
  height: 100vh;
  overflow: auto;
  letter-spacing: 1px;

  .site-logo{
    // min-height:3em;
  }

  .nav-link {
    color: #666;
    display: flex;
    align-items: center;
    margin: 0.2rem 1rem;
    border-radius: 2rem;
    // font-weight: 500;
    
    &:hover,
    &.active {
      color: #333;
      background: #eee;
    }
    i {
      margin-right: 1rem;
    }

  }
  .nav-title {
    font-size: 0.7rem;
    font-weight: bold;
    text-transform: uppercase;
    color: #ced4da;
    padding: 1rem 2rem 0.5rem 2rem;
  }
}
</style>
