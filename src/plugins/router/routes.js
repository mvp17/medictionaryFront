export const routes = [
    {
      path: "/home",
      name: "Home",
      icon: "mdi-home",
      component: () => import("../features/home/Home.vue"),
    },
    {
      path: "/search-medicine",
      name: "Search medicine",
      icon: "mdi-magnify",
      component: () => import("../features/medicines/views/SearchMedicine.vue"),
      beforeEnter: [authGuard]
    },
    {
      path: "/alarms",
      name: "Alarms",
      icon: "mdi-alarm",
      component: () => import("../features/alarms/views/Alarms.vue"),
      beforeEnter: [authGuard]
    },
    {
      path: "/reminders",
      name: "Reminders",
      icon: "mdi-reminder",
      component: () => import("../features/reminders/views/Reminders.vue"),
      beforeEnter: [authGuard]
    },
  
    {
      path: "/detailed-medicine",
      name: "Detail medicine",
      component: () => import("../features/medicines/views/DetailedMedicine.vue"),
      beforeEnter: [authGuard]
    },
];
