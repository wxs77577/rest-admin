import Vue from "vue";
import Router from "vue-router";
// import store from '../store'

import ResourceIndex from "../views/ResourceIndex";
import ResourceEdit from "../views/ResourceEdit";
import ResourceShow from "../views/ResourceShow";
import ResourceStat from "../views/ResourceStat";
import CustomForm from "../views/CustomForm";
import CustomPage from "../views/CustomPage";
import CustomTable from "../views/CustomTable";
import Login from "../views/Login";
import Logout from "../views/Logout";
import Layout from "../views/Layout";
import Home from "../views/Home";

Vue.use(Router);

const router = new Router({
  scrollBehavior() {
    return { x: 0, y: 0 };
  },

  routes: [
    {
      path: "/login",
      name: "login",
      component: Login,
      meta: {
        isPublic: true
      }
    },
    {
      path: "/logout",
      name: "logout",
      component: Logout,
      meta: {
        isPublic: true
      }
    },
    {
      path: "/",
      component: Layout,
      children: [
        {
          path: "/",
          alias: '/home',
          name: "home",
          component: Home
        },
        {
          path: "/rest/:resource/stat/:type?",
          name: "stat",
          component: ResourceStat,
          props: true,
        },
        {
          path: "/rest/:resource",
          name: "index",
          component: ResourceIndex,
          props: true,
        },
        {
          path: "/rest/:resource/create/:group?",
          name: "create",
          component: ResourceEdit,
          props: true,
        },
        {
          path: "/rest/:resource/:id/edit/:group?",
          name: "edit",
          component: ResourceEdit,
          props: true,
        },

        {
          path: "/rest/:resource/:id/:group?",
          name: "show",
          component: ResourceShow,
          props: true,
        },

        {
          path: "/form/:uri?",
          name: "form",
          component: CustomForm,
          props: true,
        },
        {
          path: "/table/:uri?",
          name: "table",
          component: CustomTable,
          props: true,
        },
        {
          path: "/page/:uri?",
          name: "page",
          component: CustomPage,
          props: true,
        }
      ]
    }
  ]
});

// router.beforeEach((to, from, next) => {
//   // if (!store.state.auth.token && !to.meta.isPublic) {
//   if (!to.meta.isPublic) {
//     return next({name: 'login'})
//   }
//   next()
// })

export default router;
