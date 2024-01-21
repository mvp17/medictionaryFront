<template>
  <h1>Reminders</h1>
  <v-row>
    <v-col>
      <form>
        <v-text-field
          v-model="state.medicine"
          :error-messages="v$.medicine.$errors.map((e) => e.$message)"
          :counter="10"
          label="Medicine"
          required
          @input="v$.medicine.$touch"
          @blur="v$.medicine.$touch"
        ></v-text-field>

        <v-text-field
          v-model="state.message"
          :error-messages="v$.message.$errors.map((e) => e.$message)"
          :counter="10"
          label="Message"
          required
          @input="v$.message.$touch"
          @blur="v$.message.$touch"
        ></v-text-field>

        <Datepicker v-model="date" :format="format"/>
        <div style="margin-top: 15px;">
          <v-btn color="success" class="me-4" @click="submit"> submit </v-btn>
          <v-btn color="error" @click="clear"> clear </v-btn>
        </div>
      </form>
    </v-col>
    <v-col>
      <v-data-table
        :headers="headers"
        :items="remindersList"
        class="elevation-1"
        item-key="medicine"
        items-per-page="5"
      ></v-data-table>
    </v-col>
  </v-row>
</template>

<script>
export default {
  inheritAttrs: false,
  data() {
    return {
      remindersList: [
        {
          medicine: "para",
          message: "careful",
          notificationTime: "17:00",
        },
        {
          medicine: "para",
          message: "careful",
          notificationTime: "17:00",
        },
      ],
      headers: [
        {
          title: "Medicine",
          align: "center",
          key: "medicine",
        },
        {
          title: "Message",
          align: "center",
          key: "message",
        },
        {
          title: "Notification Time",
          align: "center",
          key: "notificationTime",
        },
      ],
    };
  },
};
</script>

<script setup>
  import { reactive } from "vue";
  import { useVuelidate } from "@vuelidate/core";
  import { required } from "@vuelidate/validators";
  import { ref, onMounted } from "vue";
  import Datepicker from '@vuepic/vue-datepicker';
  import '@vuepic/vue-datepicker/dist/main.css';
  import { useRemindersStore } from "../stores/reminders";

  let date = ref(new Date());
  const format = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    return `${day}/${month}/${year}, ${hours}:${minutes}`;
  }

  const remindersStore = useRemindersStore();

  onMounted(() => {
    //getReminders();
  });

  function getReminders () {
    remindersStore.getAll();
  }

  const initialState = {
    medicine: "",
    message: "",
    notificationTime: "",
  };

  const state = reactive({
    ...initialState,
  });

  const rules = {
    medicine: { required },
    message: { required },
    notificationTime: { required },
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
    date = ref(new Date());
  }
</script>
@/features/reminders/stores/reminders