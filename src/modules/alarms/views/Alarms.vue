<template>
  <h1>Alarms</h1>
  <v-row>
    <v-col>
      <form>
        <v-text-field
          v-model="state.name"
          :error-messages="v$.name.$errors.map((e) => e.$message)"
          :counter="10"
          label="Name"
          required
          @input="v$.name.$touch"
          @blur="v$.name.$touch"
        ></v-text-field>

        <v-text-field
          v-model="state.time_taking_pill"
          :error-messages="v$.time_taking_pill.$errors.map((e) => e.$message)"
          :counter="10"
          label="Time taking pill"
          required
          @input="v$.time_taking_pill.$touch"
          @blur="v$.time_taking_pill.$touch"
        ></v-text-field>

        <v-text-field
          v-model.number="state.total_daily_amount"
          :error-messages="v$.total_daily_amount.$errors.map((e) => e.$message)"
          :counter="10"
          label="Total daily amount"
          required
          type="number"
          @input="v$.total_daily_amount.$touch"
          @blur="v$.total_daily_amount.$touch"
        ></v-text-field>

        <v-text-field
          v-model.number="state.treatment_length"
          :error-messages="v$.treatment_length.$errors.map((e) => e.$message)"
          :counter="10"
          label="Treatment length"
          required
          type="number"
          @input="v$.treatment_length.$touch"
          @blur="v$.treatment_length.$touch"
        ></v-text-field>

        <v-text-field
          v-model.number="state.hour_per_dosage"
          :error-messages="v$.hour_per_dosage.$errors.map((e) => e.$message)"
          :counter="10"
          label="Hour per dosage"
          required
          type="number"
          @input="v$.hour_per_dosage.$touch"
          @blur="v$.hour_per_dosage.$touch"
        ></v-text-field>

        <v-text-field
          v-model.number="state.last_day_taking_pill"
          :error-messages="v$.last_day_taking_pill.$errors.map((e) => e.$message)"
          :counter="10"
          label="Last day taking pill"
          required
          type="number"
          @input="v$.last_day_taking_pill.$touch"
          @blur="v$.last_day_taking_pill.$touch"
        ></v-text-field>

        <v-text-field
          v-model="state.status"
          :error-messages="v$.status.$errors.map((e) => e.$message)"
          :counter="10"
          label="Status"
          required
          @input="v$.status.$touch"
          @blur="v$.status.$touch"
        ></v-text-field>

        <v-btn color="success" class="me-4" @click="submit"> submit </v-btn>
        <v-btn color="error" @click="clear"> clear </v-btn>
      </form>
    </v-col>
    <v-col>
      <v-table fixed-header>
        <thead>
          <tr>
            <th class="text-center">Name</th>
            <th class="text-center">Time taking pill</th>
            <th class="text-center">Total daily amount</th>
            <th class="text-center">Treatment length</th>
            <th class="text-center">Hour per dosage</th>
            <th class="text-center">Last day of taking the pill</th>
            <th class="text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="alarm in alarms" :key="alarm.uuid">
            <td>{{ alarm.name }}</td>
            <td>{{ alarm.time_taking_pill }}</td>
            <td>{{ alarm.total_daily_amount }}</td>
            <td>{{ alarm.treatment_length }}</td>
            <td>{{ alarm.hour_per_dosage }}</td>
            <td>{{ alarm.last_day_taking_pill }}</td>
            <td>{{ alarm.status }}</td>
            <td>
              <v-btn color="warning" class="me-4" @click="editAlarm(alarm)"> edit </v-btn>
              <v-btn color="error" class="me-4" @click="deleteAlarm(alarm.uuid)"> delete </v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-col>
  </v-row>
</template>


<script setup>
  import { useAlarmsStore } from "../stores/alarms";
  import { computed, reactive } from "@vue/reactivity";
  import { useVuelidate } from "@vuelidate/core";
  import { onMounted } from "vue";
  import { required } from "@vuelidate/validators";

  const alarmsStore = useAlarmsStore();
  const alarms = computed(() => alarmsStore.alarms);

  const initialState = {
    name: "",
    time_taking_pill: "",
    total_daily_amount: 0,
    treatment_length: 0,
    hour_per_dosage: 0,
    last_day_taking_pill: 0,
    status: ""
  };

  const rules = {
    name:                 { required },
    time_taking_pill:     { required },
    total_daily_amount:   { required },
    treatment_length:     { required },
    hour_per_dosage:      { required },
    last_day_taking_pill: { required },
    status:               { required }
  };

  const state = reactive({
    ...initialState,
  });

  const v$ = useVuelidate(rules, state);
  let alarmId = "";

  onMounted(async () => {
    await alarmsStore.getAll;
  });

  async function submit() {
    const result = await v$.value.$validate();
    const request = {
      name: "",
      time_taking_pill: "",
      total_daily_amount: 0,
      treatment_length: 0,
      hour_per_dosage: 0,
      last_day_taking_pill: 0,
      status: ""
    }

    if (result) {
      request.name                 = state.name;
      request.time_taking_pill     = state.time_taking_pill;
      request.total_daily_amount   = state.total_daily_amount;
      request.treatment_length     = state.treatment_length;
      request.hour_per_dosage      = state.hour_per_dosage;
      request.last_day_taking_pill = state.last_day_taking_pill;
      request.status               = state.status;

      if (alarmId !== "") {
        await alarmsStore.updateAlarm(alarmId, request);
        alarmId = "";
      }
      else
        await alarmsStore.addAlarm(request);

      await alarmsStore.getAll;
      clear();
    }
    else alert("Validation form failed!");
  }

  async function editAlarm(/** @type {{ uuid: string, 
                                        name: string, 
                                        time_taking_pill: string, 
                                        total_daily_amount: number,
                                        treatment_length: number,
                                        hour_per_dosage: number,
                                        last_day_taking_pill: number,
                                        status: string
                                     }} */ 
                                     alarm) {
    state.name                 = alarm.name;
    state.time_taking_pill     = alarm.time_taking_pill;
    state.total_daily_amount   = alarm.total_daily_amount;
    state.treatment_length     = alarm.treatment_length;
    state.hour_per_dosage      = alarm.hour_per_dosage;
    state.last_day_taking_pill = alarm.last_day_taking_pill;
    state.status               = alarm.status;
    alarmId                    = alarm.uuid;
  }

  async function deleteAlarm(/** @type { string } */ uuid) {
    await alarmsStore.removeAlarm(uuid);
  }

  function clear() {
    v$.value.$reset();
    state.name                 = "";
    state.time_taking_pill     = "";
    state.total_daily_amount   = "";
    state.treatment_length     = "";
    state.hour_per_dosage      = "";
    state.last_day_taking_pill = "";
    state.status               = "";
  }
</script>
