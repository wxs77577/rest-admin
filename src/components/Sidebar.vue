<template>
  <div class="sidebar">
    <div class="text-center p-3" v-if="auth.user" >
      <b-img class="site-logo" :src="site.logo" fluid style="border-radius: 5px;" />
      <!-- <b-img class="site-logo" :src="require('../assets/img/gengyi-logo.svg')" fluid style="border-radius: 5px;" /> -->
      
      <!-- <b-img rounded="circle" :src="auth.user.avatar" height="70" blank-color="#777" alt="avatar" class="m-2" /> -->
      <div class="mt-3">
        <h5 style="letter-spacing:2px">{{site.name}}</h5>
        <b-badge class="text-uppercase">{{auth.user.role}}</b-badge> 
        <span>{{auth.user.username}}</span>
      </div>
      <languages />
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
                  <router-link :to="child.url" class="nav-link" active-class="active">
                    <i :class="child.icon"></i> {{child.name}}
                    <b-badge v-bind="child.badge" v-if="child.badge">{{child.badge.text}}</b-badge>

                  </router-link>
                </div>
              </li>
            </ul>
          </li>
          <li class="nav-item" v-else :key="index">
            <div>

              <router-link :to="item.url" class="nav-link" active-class="active">
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
import Languages from './Languages'

import { mapState } from "vuex";
export default {
  name: "sidebar",

  computed: {
    ...mapState(["auth", "site"])
  },
  components: {Languages},
  methods: {
    toggle(item) {
      this.$set(item, "open", !item.open);
    }
  }
};
</script>

<style lang="css">
.site-logo {
  background: #fff;
  /* padding:1em; */
}
</style>
