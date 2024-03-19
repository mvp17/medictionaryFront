import http from '@/http-common';
import { defineStore } from 'pinia';

export const useUserStore = defineStore('users', {
  state: () => ({
    /** @type {{ username: string, email: string, token: string}} */
    user: { username: "", email: "", token: "" }
  }),
  getters: {
    getUser(state) {
      return state.user
    }
  },
  actions: {
    async registerUser(/** @type {{ username: string, email: string, password: string }} */ newUser) {
      const data = await http.post('/auth/signup', newUser);
      this.user.email = data.data.email;
      this.user.username = data.data.username;
    },
    async loginUser(/** @type {{ username: string, password: string }} */ currentUser) {
      const data = await http.post("/auth/signin", currentUser);
      this.user.token = data.data.token;
    }
  },
});
