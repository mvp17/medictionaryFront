import { defineStore } from 'pinia';
import http from "../http-common";

export const useRemindersStore = defineStore('reminders', {
  state: () => ({
    /** @type {{ id: number, medicine: string, message: string, notificationTime: string, totalDailyDosage: number }[]} */
    reminders: [],
  }),
  getters: {
    getAll: async (state) => {
      const apiResponse = await http.get("/reminders");
      state.reminders = apiResponse.data;
    },
    getById: (state) => {
      return (id) => state.reminders.find((reminder) => reminder.id === id);
    },
  },
  actions: {
    async addReminder(newReminder) {
      const apiResponse = await http.post("/createReminder", newReminder);
      this.reminders = [...this.reminders, apiResponse.data];
    },
    async updateReminder(id, currentReminder) {
      const apiResponse = await http.put(`/updateReminder/${id}`, currentReminder);
      let remindersState = this.reminders.filter((reminder) => reminder.id !== id);
      remindersState.push(apiResponse.data);
      this.reminders = remindersState;
    },
    /*
    async removePlayer(id) {
      await http.delete(`/players/${id}`);
      this.players = this.players.filter((player) => player.id !== id);
    },
    */
  },
});
