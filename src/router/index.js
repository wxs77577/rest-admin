import Vue from 'vue'
import Router from 'vue-router'
import ResourceIndex from '../components/ResourceIndex'
import ResourceEdit from '../components/ResourceEdit'
import Login from '../components/Login'
import Layout from '../components/Layout'
import Home from '../components/Home'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      component: Layout,
      children: [
        {
          path: '/',
          name: 'home',
          component: Home,
        },
        {
          path: '/rest/:resource',
          name: 'index',
          component: ResourceIndex
        },
        {
          path: '/rest/:resource/create',
          name: 'create',
          component: ResourceEdit
        },
        {
          path: '/rest/:resource/:id',
          name: 'edit',
          component: ResourceEdit
        },
      ]
    },
    
    
    
    
    
    
  ]
})
