<template>
  <div>
    <v-app-bar app color="orange" dark>
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
      <v-toolbar-title>Medictionary</v-toolbar-title>
      <v-spacer></v-spacer>
      <p v-for="item in items">
        <router-link
          style="text-decoration: none; color: inherit"
          :to="item.path"
        >
          <v-btn v-if="item.icon !== undefined" :prepend-icon="item.icon">
            {{ item.name }}
          </v-btn>
        </router-link>
      </p>
    </v-app-bar>
  </div>
</template>
  
<script>
  import { routes } from "@/plugins/router";
  export default {
    name: "Header",
    data: () => ({
      items: routes,
      drawer: false,
    }),
  };
</script>