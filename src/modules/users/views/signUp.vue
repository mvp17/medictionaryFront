<template>
    <h1>Sign Up</h1>
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
                v-model="state.email"
                :error-messages="v$.email.$errors.map((e) => e.$message)"
                :counter="10"
                label="Email"
                required
                @input="v$.email.$touch"
                @blur="v$.email.$touch"
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
            <v-btn color="primary" class="me-4" @click="router.go(-1);"> back </v-btn>
            <v-btn color="success" class="me-4" @click="submit"> submit </v-btn>
            <v-btn color="error" @click="clear"> clear </v-btn>
        </form>
    </v-card>
    </div>
</template>

<script setup>
    import { reactive } from 'vue';
    import { useVuelidate } from '@vuelidate/core';
    import { required, email } from '@vuelidate/validators';
    import { useUserStore } from '../stores/userStore';
    import { router } from '@/plugins/router/router';

    const userStore = useUserStore();

    const initialState = {
        username: '',
        email: '',
        password: '',
    };

    const state = reactive({...initialState,});

    const rules = {
        username: { required },
        email: { required, email },
        password: { required },
    };

    const v$ = useVuelidate(rules, state);

    async function submit() {
        const result = await v$.value.$validate();
        const request = { username: "", email: "", password: "" };

        if (result) {
            request.username = state.username;
            request.email = state.email;
            request.password = state.password;
            userStore.registerUser(request);
            router.push('/');
        }
        else alert("Validation form failed!");
    }

    function clear() {
        v$.value.$reset();
        state.email = "";
        state.username = "";
        state.email = "";
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
