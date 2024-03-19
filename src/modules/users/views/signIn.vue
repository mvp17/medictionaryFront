<template>
  <h1>Sign In</h1>
  <div class="center-container">
    <v-card>
      <form>
        <v-text-field
          v-model="state.username"
          :error-messages="v$.username.$errors.map((e) => e.$message)"
          :counter="10"
          label="Username"
          required
          @input="v$.username.$touch"
          @blur="v$.username.$touch"
        ></v-text-field>
  
        <v-text-field
          type="password"
          v-model="state.password"
          :error-messages="v$.password.$errors.map((e) => e.$message)"
          :counter="10"
          label="Password"
          required
          @input="v$.password.$touch"
          @blur="v$.password.$touch"
        ></v-text-field>
        <v-btn color="primary" class="me-4" @click="router.push('/register');"> Sign Up </v-btn>
        <v-btn color="success" class="me-4" @click="submit"> submit </v-btn>
        <v-btn color="error" @click="clear"> clear </v-btn>
      </form>
    </v-card>
  </div>
</template>

<script setup>
  import { reactive } from 'vue';
  import { useVuelidate } from '@vuelidate/core';
  import { required } from '@vuelidate/validators';
  import { useUserStore } from '../stores/userStore';
  import { router } from '@/plugins/router/router';

  const userStore = useUserStore();

  const initialState = {
    username: "",
    password: "",
  };
  
  const state = reactive({...initialState,});

  const rules = {
    username: { required },
    password: { required },
  };

  const v$ = useVuelidate(rules, state);

  async function submit() {
    const result = await v$.value.$validate();
    const request = { username: "", password: "" };

    if (result) {
      request.username = state.username;
      request.password = state.password;

      await userStore.loginUser(request);
      router.push('/');
    }
    else alert("Validation form failed!");
  }

  function clear() {
    v$.value.$reset();
    state.username = "";
    state.password = "";
  }
</script>

<style>
  .center-container {
    display: flex;
    justify-content: center; /* Horizontally center */
    align-items: center; /* Vertically center */
    height: 100vh; /* Adjust as needed */
  }
</style>
