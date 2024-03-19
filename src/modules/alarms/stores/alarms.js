import { defineStore } from 'pinia';
import http from "../../../http-common";

export const useAlarmsStore = defineStore('alarms', {
  state: () => ({
    /** @type {{ id: number, name: string, time_taking_pill: string, total_daily_amount: number, treatment_length: number, hour_per_dosage: number, last_day_taking_pill: number, status: string }[]} */
    alarms: [],
  }),
  getters: {
    getAll: async (state) => {
      http.interceptors.request.use(async (request) => {
        const token = useUserStore.getUser.token;
        if (token !== "") request.headers.Authorization = `Bearer ${token}`;
        return request;
      });
      const apiResponse = await http.get("/alarms");
      state.alarms = apiResponse.data;
    },
    getById: (state) => {
      return (id) => state.alarms.find((alarm) => alarm.id === id);
    },
  },
  actions: {
    async addAlarm(newAlarm) {
      const apiResponse = await http.post("/createAlarm", newAlarm);
      this.alarms = [...this.alarms, apiResponse.data];
    },
    async updateAlarm(id, currentAlarm) {
      const apiResponse = await http.put(`/updateAlarm/${id}`, currentAlarm);
      let alarmsState = this.alarms.filter((alarm) => alarm.id !== id);
      alarmsState.push(apiResponse.data);
      this.alarms = alarmsState;
    },
    /*
    async removePlayer(id) {
      await http.delete(`/players/${id}`);
      this.players = this.players.filter((player) => player.id !== id);
    },
    */
  },
});
