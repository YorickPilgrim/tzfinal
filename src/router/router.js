// router/index.js

import { createRouter, createWebHistory } from "vue-router"
import Home from "../pages/TZmain.vue"
// import Favorites from "../pages/Favorites.vue"

const routes = [
  {
    path: "/home",
    name: "Home",
    alias: "/",
    component: Home,
  },
  {
    path: "/tzfinal",
    name: "/Home",
    component: Home,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
