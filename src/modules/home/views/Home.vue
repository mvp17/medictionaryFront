<template>
  <h1>Home</h1>
  <form>
    <v-select
      v-model="state.smoker"
      :items="smokingLevels"
      :error-messages="v$.smoker.$errors.map((e) => e.$message)"
      label="Are you a smoker?"
      item-title="level"
      item-value="value"
      required
      @change="v$.smoker.$touch"
      @blur="v$.smoker.$touch"
    ></v-select>

    <v-select
      v-model="state.drinker"
      :items="drinkingLevels"
      :error-messages="v$.drinker.$errors.map((e) => e.$message)"
      label="Are you a drinker?"
      item-title="level"
      item-value="value"
      required
      @change="v$.drinker.$touch"
      @blur="v$.drinker.$touch"
    ></v-select>

    <v-text-field
      v-model="state.breakfast"
      :error-messages="v$.breakfast.$errors.map((e) => e.$message)"
      :counter="10"
      label="Breakfast"
      required
      @input="v$.breakfast.$touch"
      @blur="v$.breakfast.$touch"
    ></v-text-field>

    <v-text-field
      v-model="state.lunch"
      :error-messages="v$.lunch.$errors.map((e) => e.$message)"
      :counter="10"
      label="Lunch"
      required
      @input="v$.lunch.$touch"
      @blur="v$.lunch.$touch"
    ></v-text-field>

    <v-text-field
      v-model="state.coldMd"
      :error-messages="v$.coldMd.$errors.map((e) => e.$message)"
      :counter="10"
      label="Cold MD"
      required
      @input="v$.coldMd.$touch"
      @blur="v$.coldMd.$touch"
    ></v-text-field>

    <v-text-field
      v-model="state.prescribed"
      :error-messages="v$.prescribed.$errors.map((e) => e.$message)"
      :counter="10"
      label="Prescribed"
      required
      @input="v$.prescribed.$touch"
      @blur="v$.prescribed.$touch"
    ></v-text-field>

    <v-text-field
      v-model="state.allergy"
      :error-messages="v$.allergy.$errors.map((e) => e.$message)"
      :counter="10"
      label="Allergy"
      required
      @input="v$.allergy.$touch"
      @blur="v$.allergy.$touch"
    ></v-text-field>

    <v-btn color="success" class="me-4" @click="submit"> submit </v-btn>
    <v-btn color="error" @click="clear"> clear </v-btn>
  </form>
</template>


<script setup>
  import { reactive, computed } from "vue";
  import { useVuelidate } from "@vuelidate/core";
  import { required, numeric } from "@vuelidate/validators";
  import { useSurveyStore } from "../stores/survey";
  import { mustBeGreaterThan0 } from "@/core/utils/functions";
  import { onMounted } from "vue";

  const surveyStore = useSurveyStore();
  const survey = computed(() => surveyStore.survey);

  const smokingLevels = [
    { level: "None",         value: 1 },
    { level: "Occasionally", value: 2 },
    { level: "Usually",      value: 3 },
    { level: "Compulsively", value: 4 }
  ];

  const drinkingLevels = [
    { level: "None",                value: 1 },
    { level: "Rarely",              value: 2 },
    { level: "In meals",            value: 3 },
    { level: "In my leisure times", value: 4 },
    { level: "Compulsively",        value: 5 }
  ];

  const initialState = {
    smoker: 0,
    drinker: 0,
    breakfast: "",
    lunch: "",
    coldMd: "",
    prescribed: "",
    allergy: "",
  };

  const state = reactive({
    ...initialState,
  });

  const rules = {
    smoker:     { required, numeric, mustBeGreaterThan0 },
    drinker:    { required, numeric, mustBeGreaterThan0 },
    breakfast:  { required },
    lunch:      { required },
    coldMd:     { required },
    prescribed: { required },
    allergy:    { required },
  };

  const v$ = useVuelidate(rules, state);

  onMounted(async () => {
    await surveyStore.getAll;
  });

  async function submit() {
    const result = await v$.value.$validate();
    const request = { 
      smoker: 0, 
      drinker: 0, 
      breakfast: "", 
      lunch: "", 
      coldMd: "", 
      prescribed: "", 
      allergy: "" 
    };

    if (result) {
      request.allergy    = state.allergy;
      request.breakfast  = state.breakfast;
      request.coldMd     = state.coldMd;
      request.drinker    = state.drinker;
      request.lunch      = state.lunch;
      request.prescribed = state.prescribed;
      request.smoker     = state.smoker;

      clear();
    }
  }

  function clear() {
    v$.value.$reset();
    state.allergy    = "";
    state.breakfast  = "";
    state.coldMd     = "";
    state.drinker    = "";
    state.lunch      = "";
    state.prescribed = "";
    state.smoker     = "";
  }
</script>
