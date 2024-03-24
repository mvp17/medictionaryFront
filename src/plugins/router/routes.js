import { authGuard } from "./guards";

export const routes = [
    {
      path: "/",
      name: "Home",
      icon: "mdi-home",
      component: () => import("../../modules/home/views/Home.vue"),
      beforeEnter: [authGuard]
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import("../../modules/users/views/signIn.vue")
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import("../../modules/users/views/signUp.vue")
    },
    {
      path: "/search-medicine",
      name: "Search",
      icon: "mdi-magnify",
      component: () => import("../../modules/medicines/views/SearchMedicine.vue"),
      beforeEnter: [authGuard]
    },
    {
      path: "/detailed-medicine",
      name: "Detail medicine",
      component: () => import("../../modules/medicines/views/DetailedMedicine.vue"),
      beforeEnter: [authGuard]
    },
    {
      path: "/medicines",
      name: "Medicines",
      icon: "mdi-pill",
      component: () => import("../../modules/medicines/views/Medicines.vue"),
      beforeEnter: [authGuard]
    },
    {
      path: "/alarms",
      name: "Alarms",
      icon: "mdi-alarm",
      component: () => import("../../modules/alarms/views/Alarms.vue"),
      beforeEnter: [authGuard]
    },
    {
      path: "/reminders",
      name: "Reminders",
      icon: "mdi-reminder",
      component: () => import("../../modules/reminders/views/Reminders.vue"),
      beforeEnter: [authGuard]
    },
];
