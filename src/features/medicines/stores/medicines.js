import { defineStore } from 'pinia';
import http from "../../../http-common";

export const useMedicinesStore = defineStore('medicines', {
  state: () => ({
    /** @type {{ id: number, name: string, description: string, sideEffects: string, totalDailyDosage: number }[]} */
    medicines: [],
  }),
  getters: {
    getAll: async (state) => {
      const apiResponse = await http.get("/medicines");
      state.medicines = apiResponse.data;
    },
    getById: (state) => {
      return (id) => state.medicines.find((medicine) => medicine.id === id);
    },
  },
  actions: {
    async addMedicine(newMedicine) {
      const apiResponse = await http.post("/createMedicine", newMedicine);
      this.medicines = [...this.medicines, apiResponse.data];
    },
    async updateMedicine(id, currentMedicine) {
      const apiResponse = await http.put(`/updateMedicine/${id}`, currentMedicine);
      let medicinesState = this.medicines.filter((medicine) => medicine.id !== id);
      medicinesState.push(apiResponse.data);
      this.medicines = medicinesState;
    },
    /*
    async removePlayer(id) {
      await http.delete(`/players/${id}`);
      this.players = this.players.filter((player) => player.id !== id);
    },
    */
  },
});
