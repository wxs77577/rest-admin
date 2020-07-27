import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '../views/Layout.vue'
import Home from '../views/Home.vue'
import Crud from '../views/Crud.vue'

Vue.use(VueRouter)

/**
 * @type {import('vue-router').RouteConfig[]}
 */
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Layout,
    children: [
      { path: '/', name: 'home', component: Home },
      { path: '/crud/:resource', name: 'crud', component: Crud, props: true },
    ]
  },
]

const router = new VueRouter({
  routes
})

export default router
