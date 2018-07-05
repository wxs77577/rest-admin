import Vue from 'vue'
import Router from 'vue-router'
// import store from '../store'

import ResourceIndex from '../views/ResourceIndex'
import ResourceEdit from '../views/ResourceEdit'
import ResourceShow from '../views/ResourceShow'
import ResourceStat from '../views/ResourceStat'
import CustomForm from '../views/CustomForm'
import CustomPage from '../views/CustomPage'
import Login from '../views/Login'
import Logout from '../views/Logout'
import Layout from '../views/Layout'
import Home from '../views/Home'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        isPublic: true
      }
    },
    {
      path: '/logout',
      name: 'logout',
      component: Logout,
      meta: {
        isPublic: true
      }
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
          path: '/rest/:resource/stat',
          name: 'stat',
          component: ResourceStat
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
          path: '/rest/:resource/:id/edit',
          name: 'edit',
          component: ResourceEdit
        },
        
        {
          path: '/rest/:resource/:id',
          name: 'show',
          component: ResourceShow
        },
        {
          path: '/form',
          name: 'form',
          component: CustomForm
        },
        {
          path: '/page',
          name: 'page',
          component: CustomPage
        },
      ]
    },
  ]
})

// router.beforeEach((to, from, next) => {
//   // if (!store.state.auth.token && !to.meta.isPublic) {
//   if (!to.meta.isPublic) {
//     return next({name: 'login'})
//   }
//   next()
// })

export default router