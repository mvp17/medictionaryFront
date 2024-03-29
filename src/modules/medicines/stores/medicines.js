import { defineStore } from 'pinia';
import http from "../../../http-common";
import { useUserStore } from '@/modules/users/stores/userStore';

export const useMedicinesStore = defineStore('medicines', {
  state: () => ({
    /** @type {{ uuid: string, 
     *           name: string, 
     *           description: string, 
     *           sideEffects: string, 
     *           totalDailyDosage: number }[]} 
    */
    medicines: [],
    medicine: {
      uuid: "",
      name: "",
      description: "",
      sideEffects: "",
      totalDailyDosage: ""
    }
  }),
  getters: {
    getAll: async (state) => {
      http.interceptors.request.use(async (request) => {
        const userStore = useUserStore();
        const token = userStore.getUser.token;
        if (token !== "") request.headers.Authorization = `Bearer ${token}`;
        return request;
      });
      const apiResponse = await http.get("/medicines");
      state.medicines = apiResponse.data;
    }
  },
  actions: {
    async getById(/** @type { string } */ uuid) {
      const apiResponse = await http.get(`/medicines/${uuid}`);
      this.medicine = apiResponse.data;
    },

    async addMedicine(/** @type {{ name: string, 
                                   description: string, 
                                   side_effects: string,
                                   total_daily_dosage: number
                                }} */
                              newMedicine) {
      const apiResponse = await http.post("/medicines", newMedicine);
      this.medicines = [...this.medicines, apiResponse.data];
    },
    async updateMedicine(/** @type { string } */ uuid,
                         /** @type {{ name: string, 
                          *           description: string, 
                          *           side_effects: string,
                          *           total_daily_dosage: number
                                   }} */
                          currentMedicine) {
      const apiResponse = await http.put(`/medicines/${uuid}`, currentMedicine);
      let medicinesState = this.medicines.filter((medicine) => medicine.uuid !== uuid);
      medicinesState.push(apiResponse.data);
      this.medicines = medicinesState;
    },
    
    async removeMedicine(/** @type { string } */ uuid) {
      await http.delete(`/medicines/${uuid}`);
      this.medicines = this.medicines.filter((medicine) => medicine.uuid !== uuid);
    }
  },
});
