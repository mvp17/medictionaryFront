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

        <Datepicker v-model="state.notification_time" :format="format"/>
        <div style="margin-top: 15px;">
          <v-btn color="success" class="me-4" @click="submit"> submit </v-btn>
          <v-btn color="error" @click="clear"> clear </v-btn>
        </div>
      </form>
    </v-col>
    <v-col>
      <v-data-table
        :headers="headers"
        :items="reminders"
        class="elevation-1"
        item-key="id"
        items-per-page="5"
      >
        <template v-slot:headers>
          <tr>
            <th v-for="header in headers" :key="header.text">
              {{ header.text }}
            </th>
          </tr>
        </template>
        <template v-slot:[`item.action`]="{ item }">
          <v-btn @click="editReminder(item)" color="warning"> edit </v-btn>
          <v-btn @click="deleteReminder(item.uuid)" color="error"> delete </v-btn>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>


<script setup>
  import { computed, reactive } from "vue";
  import { useVuelidate } from "@vuelidate/core";
  import { required } from "@vuelidate/validators";
  import { ref, onMounted } from "vue";
  import Datepicker from '@vuepic/vue-datepicker';
  import '@vuepic/vue-datepicker/dist/main.css';
  import { useRemindersStore } from "../stores/reminders";

  const format = (/** @type { Date } */ date) => {
    const day     = String(date.getDate()).padStart(2, '0');
    const month   = String(date.getMonth() + 1).padStart(2, '0');
    const year    = date.getFullYear();
    const hours   = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year}, ${hours}:${minutes}`;
  }
  const remindersStore = useRemindersStore();
  const reminders = computed(() => remindersStore.reminders);
  const headers = [
    //{ text: 'Id',                value: 'uuid'},
    { text: 'Medicine',          value: 'medicine'},
    { text: 'Message',           value: 'message'},
    { text: 'Notification Time', value: 'notification_time'},
    { text: 'Actions',           value: 'action' },
  ];
  const initialState = {
    medicine: "",
    message: "",
    notification_time: ref(new Date()),
  };

  const state = reactive({
    ...initialState,
  });

  const rules = {
    medicine:         { required },
    message:          { required },
    notification_time: { required },
  };

  const v$ = useVuelidate(rules, state);
  let reminderId = "";

  onMounted(async () => {
    await remindersStore.getAll;
  });

  async function submit() {
    const result = await v$.value.$validate();
    const request = {
      medicine: "",
      message: "",
      notification_time: ""
    };

    if (result) {
      request.medicine          = state.medicine;
      request.message           = state.message;
      request.notification_time = state.notification_time.toLocaleString();

      if (reminderId !== "") {
        await remindersStore.updateReminder(reminderId, request);
        reminderId = "";
      }
      else
        await remindersStore.addReminder(request);
      
      await remindersStore.getAll;
      clear();
    }
    else alert("Validation form failed!");
  }

  async function editReminder(/** @type {{ uuid: string, 
                                           medicine: string, 
                                           message: string, 
                                           notification_time: string 
                                        }} */ 
                                        reminder) {
    state.medicine = reminder.medicine;
    state.message  = reminder.message;

    const [datePart, timePart] = reminder.notification_time.split(', ');
    const [day, month, year] = datePart.split('/');
    const [hours, minutes, seconds] = timePart.split(':');
    const dateObject = new Date(year, month - 1, day, hours, minutes, seconds);    
    
    state.notification_time = dateObject;
    reminderId              = reminder.uuid
  }

  async function deleteReminder(/** @type { string } */ uuid) {
    await remindersStore.removeReminder(uuid);
  }

  function clear() {
    v$.value.$reset();
    state.medicine          = "";
    state.message           = "";
    state.notification_time = ref(new Date());
  }
</script>
