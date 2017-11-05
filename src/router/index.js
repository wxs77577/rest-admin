import Vue from 'vue'
import Router from 'vue-router'
import ResourceIndex from '../components/ResourceIndex'
import ResourceEdit from '../components/ResourceEdit'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/:resource',
      name: 'index',
      component: ResourceIndex
    },
    {
      path: '/:resource/:id',
      name: 'edit',
      component: ResourceEdit
    },
    
  ]
})
