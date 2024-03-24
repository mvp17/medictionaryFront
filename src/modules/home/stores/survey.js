import { defineStore } from 'pinia';
import http from '@/http-common';
import { useUserStore } from '@/modules/users/stores/userStore';

export const useSurveyStore = defineStore('survey', {
  state: () => ({
    /** @type { smoker: number, 
     *          drinker: number,
     *          breakfast: string,
     *          lunch: string,
     *          cold_md: string,
     *          prescribed: string,
     *          allergy: string } 
    */
    survey: {
        smoker: 0,
        drinker: 0,
        breakfast: "",
        lunch: "",
        coldMd: "",
        prescribed: "",
        allergy: "",
    },
  }),
  actions: {
    async registerSurvey(/** @type { smoker: number, 
                                     drinker: number,
                                     breakfast: string,
                                     lunch: string, 
                                     cold_md: string,
                                     prescribed: string,
                                     allergy: string } 
                        */
                        newSurvey) {
        http.interceptors.request.use(async (request) => {
            const userStore = useUserStore();
            const token = userStore.getUser.token;
            if (token !== "") request.headers.Authorization = `Bearer ${token}`;
            return request;
        });
        const apiResponse = await http.post("/survey", newSurvey);
        this.survey = apiResponse.data;
    }
  }
});
