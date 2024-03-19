import { defineStore } from 'pinia';
import http from '@/http-common';
import { useUserStore } from '@/modules/users/stores/userStore';

export const useRemindersStore = defineStore('reminders', {
  state: () => ({
    /** @type {{ uuid: string, medicine: string, message: string, notificationTime: string }[]} */
    reminders: [],
  }),
  getters: {
    getAll: async (state) => {
      http.interceptors.request.use(async (request) => {
        const userStore = useUserStore();
        const token = userStore.getUser.token;
        if (token !== "") request.headers.Authorization = `Bearer ${token}`;
        return request;
      });
      const apiResponse = await http.get("/reminders");
      state.reminders = apiResponse.data;
    },
    getById: (state) => {
      return (id) => state.reminders.find((reminder) => reminder.id === id);
    },
  },
  actions: {
    async addReminder(/** @type {{ medicine: string, message: string, notification_time: string }} */ newReminder) {
      const apiResponse = await http.post("/reminders", newReminder);
      this.reminders = [...this.reminders, apiResponse.data];
    },
    async updateReminder(/** @type { string } */ uuid, 
                         /** @type {{ medicine: string, message: string, notification_time: string }} */ currentReminder) {
      const apiResponse = await http.put(`/reminders/${uuid}`, currentReminder);
      let remindersState = this.reminders.filter((reminder) => reminder.uuid !== uuid);
      remindersState.push(apiResponse.data);
      this.reminders = remindersState;
    },
    
    async removeReminder(/** @type { string } */ uuid) {
      await http.delete(`/reminders/${uuid}`);
      this.reminders = this.reminders.filter((reminder) => reminder.uuid !== uuid);
    },
    
  },
});
