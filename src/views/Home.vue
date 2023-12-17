<template>
  <h1>Home</h1>
  <form>
    <v-text-field
      v-model="state.smoker"
      :error-messages="v$.smoker.$errors.map((e) => e.$message)"
      :counter="10"
      label="Smoker"
      required
      @input="v$.smoker.$touch"
      @blur="v$.smoker.$touch"
    ></v-text-field>

    <v-text-field
      v-model="state.drinker"
      :error-messages="v$.drinker.$errors.map((e) => e.$message)"
      :counter="10"
      label="Drinker"
      required
      @input="v$.drinker.$touch"
      @blur="v$.drinker.$touch"
    ></v-text-field>

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

<script>
  export default {
    inheritAttrs: false,
  };
</script>

<script setup>
  import { reactive } from "vue";
  import { useVuelidate } from "@vuelidate/core";
  import { required } from "@vuelidate/validators";

  const initialState = {
    smoker: "",
    drinker: "",
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
    smoker: { required },
    drinker: { required },
    breakfast: { required },
    lunch: { required },
    coldMd: { required },
    prescribed: { required },
    allergy: { required },
  };

  const v$ = useVuelidate(rules, state);

  async function submit() {
    const result = await v$.value.$validate();
    const request = {};
    if (result) {
      for (const key of Object.keys(initialState)) {
        request[key] = state[key];
      }
    }
  }

  function clear() {
    v$.value.$reset();

    for (const [key, value] of Object.entries(initialState)) {
      state[key] = value;
    }
  }
</script>
