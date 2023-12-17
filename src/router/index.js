// Composables
import { createRouter, createWebHistory } from 'vue-router'

export const routes = [
  {
    path: "/home",
    name: "Home",
    icon: "mdi-home",
    component: () => import("../views/Home.vue"),
  },
  {
    path: "/search-medicine",
    name: "Search medicine",
    icon: "mdi-magnify",
    component: () => import("../views/SearchMedicine.vue"),
  },
  {
    path: "/alarms",
    name: "Alarms",
    icon: "mdi-alarm",
    component: () => import("../views/Alarms.vue"),
  },
  {
    path: "/reminders",
    name: "Reminders",
    icon: "mdi-reminder",
    component: () => import("../views/Reminders.vue"),
  },

  {
    path: "/detailed-medicine",
    name: "Detail medicine",
    component: () => import("../views/DetailedMedicine.vue"),
  },
]

export const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});
