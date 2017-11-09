import Vue from 'vue'
import Router from 'vue-router'
import store, {types} from '../store'

import ResourceIndex from '../components/ResourceIndex'
import ResourceEdit from '../components/ResourceEdit'
import Login from '../components/Login'
import Layout from '../components/Layout'
import Home from '../components/Home'

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

router.beforeEach((to, from, next) => {
  if (!store.state.auth.token && !to.meta.isPublic) {
    // console.log('no token');
    return next({name: 'login'})
  }
  next()
})

export default router