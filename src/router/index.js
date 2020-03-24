import Vue from "vue"
import VueRouter from "vue-router"
import Home from "../views/Home.vue"

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/country/:countryName",
    name: "Country",
    props: true,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "country" */ "../views/Country.vue"),
  },
  {
    path: "/Compare",
    name: "Compare",
    component: () => import(/* webpackChunkName: "compare" */ "../views/CountryComparison.vue"),
  },
]

const router = new VueRouter({
  routes,
})

export default router
