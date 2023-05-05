import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    // component: HomeView,
    component: () =>
      import(/* webpackChunkName: "home" */ "../views/HomeView.vue"),
  },
  // {
  //     path: "/chat",
  //     name: "chat",
  //     // route level code-splitting
  //     // this generates a separate chunk (about.[hash].js) for this route
  //     // which is lazy-loaded when the route is visited.
  //     component: () =>
  //         import ( /* webpackChunkName: "about" */ "../views/UserPreview.vue"),
  // },
  // {
  //     path: "/resume",
  //     name: "resume",
  //     // route level code-splitting
  //     // this generates a separate chunk (about.[hash].js) for this route
  //     // which is lazy-loaded when the route is visited.
  //     component: () =>
  //         import ( /* webpackChunkName: "about" */ "../views/ResumeView.vue"),
  // },
  // //二维码扫描页面
  // {
  //     path: "/code",
  //     name: "code",
  //     // route level code-splitting
  //     // this generates a separate chunk (about.[hash].js) for this route
  //     // which is lazy-loaded when the route is visited.
  //     component: () =>
  //         import ( /* webpackChunkName: "about" */ "../views/Scan.vue"),
  // },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
