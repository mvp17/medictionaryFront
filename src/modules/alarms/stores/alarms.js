import { defineStore } from 'pinia';
import http from "../../../http-common";
import { useUserStore } from '@/modules/users/stores/userStore';

export const useAlarmsStore = defineStore('alarms', {
  state: () => ({
    /** @type {{ uuid: number, 
                 name: string, 
                 time_taking_pill: string, 
                 total_daily_amount: number, 
                 treatment_length: number, 
                 hour_per_dosage: number, 
                 last_day_taking_pill: number, 
                 status: string }[]} 
    */
    alarms: [],
  }),
  getters: {
    getAll: async (state) => {
      http.interceptors.request.use(async (request) => {
        const userStore = useUserStore();
        const token = userStore.getUser.token;
        if (token !== "") request.headers.Authorization = `Bearer ${token}`;
        return request;
      });
      const apiResponse = await http.get("/alarms");
      state.alarms = apiResponse.data;
    },
    getById: (state) => {
      return (uuid) => state.alarms.find((alarm) => alarm.uuid === uuid);
    },
  },
  actions: {
    async addAlarm(/** @type {{ name: String, 
                                time_taking_pill: String, 
                                total_daily_amount: Number, 
                                treatment_length: Number, 
                                hour_per_dosage: Number, 
                                last_day_taking_pill: Number, 
                                status: String
                             }} */
                      newAlarm) {
      const apiResponse = await http.post("/alarms", newAlarm);
      this.alarms = [...this.alarms, apiResponse.data];
    },
    async updateAlarm(/** @type { string } */ uuid, 
                      /** @type {{ name: String, 
                                   time_taking_pill: String, 
                                   total_daily_amount: Number, 
                                   treatment_length: Number, 
                                   hour_per_dosage: Number, 
                                   last_day_taking_pill: Number, 
                                   status: String
                                }} */
                        currentAlarm) {
      const apiResponse = await http.put(`/alarms/${uuid}`, currentAlarm);
      let alarmsState = this.alarms.filter((alarm) => alarm.uuid !== uuid);
      alarmsState.push(apiResponse.data);
      this.alarms = alarmsState;
    },
    
    async removeAlarm(/** @type { string } */ uuid) {
      await http.delete(`/alarms/${uuid}`);
      this.alarms = this.alarms.filter((alarm) => alarm.uuid !== uuid);
    },
  },
});
