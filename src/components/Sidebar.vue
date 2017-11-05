<template>
  <div class="sidebar">
    
    <nav class="sidebar-nav">
      <div slot="header"></div>
      <ul class="nav">
        <template v-for="(item, index) in navItems">
          <li class="nav-title" v-if="item.title">
            {{item.name}}
          </li>
          <li class="devider" v-else-if="item.divider"> </li>

          <li class="nav-item nav-dropdown" :class="{open: item.open}" v-else-if="item.children">
                <div class="nav-link nav-dropdown-toggle" @click="toggle(item)">
                  <i :class="item.icon"></i> {{item.name}}
                  <b-badge v-bind="item.badge" v-if="item.badge">{{item.badge.text}}</b-badge>
                </div>
                <ul class="nav-dropdown-items">
                  <li class="nav-item" v-for="child in item.children">
                    <div>
                      <router-link :to="child.url" class="nav-link">
                        <i :class="child.icon"></i> {{child.name}}
                        <b-badge v-bind="child.badge" v-if="child.badge">{{child.badge.text}}</b-badge>
                        
                      </router-link>
                    </div>
                  </li>
                </ul>
              </li>
          <li class="nav-item" v-else>
            <div>
              
              <router-link :to="item.url" class="nav-link">                
                    <i :class="item.icon"></i> {{item.name}}
                    <b-badge v-bind="item.badge" v-if="item.badge">{{item.badge.text}}</b-badge>
                  </router-link>
            </div>
          </li>
        </template>
      </ul>
      <slot></slot>
    </nav>
    
  </div>
</template>
<script>

export default {
  name: 'sidebar',
  props: {
    navItems: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  components: {
    
  },
  methods: {
    toggle(item){
      this.$set(item, 'open', !item.open)
      
    }
  }
}
</script>

<style lang="css">
  .nav-link {
    cursor:pointer;
  }
</style>
