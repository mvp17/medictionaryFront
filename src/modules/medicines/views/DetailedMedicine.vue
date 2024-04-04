<template>
  <h1>Detail</h1>
  <v-card class="mx-auto" max-width="344">
    <v-img
      src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
      height="200px"
      cover
    ></v-img>

    <v-card-title> Detailed Medicine </v-card-title>

    <v-card-subtitle> Medicine {{ medicine.name }} </v-card-subtitle>

    <v-card-actions>
      <v-dialog v-model="dialog" persistent width="1024">
        <template v-slot:activator="{ props }">
          <v-btn color="orange-lighten-2" v-bind="props" variant="text">
            Set alarm
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="text-h5">Setting alarm for this medicine</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="state.time_taking_pill"
                    :error-messages="v$.time_taking_pill.$errors.map((e) => e.$message)"
                    @input="v$.time_taking_pill.$touch"
                    @blur="v$.time_taking_pill.$touch"
                    label="Time taking pill*"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field 
                    v-model="state.name"
                    :error-messages="v$.name.$errors.map((e) => e.$message)"
                    label="Name*"
                    hint="focus"
                    required
                    @input="v$.name.$touch"
                    @blur="v$.name.$touch"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model.number="state.total_daily_amount"
                    :error-messages="v$.total_daily_amount.$errors.map((e) => e.$message)"
                    label="Total daily amount*"
                    hint="focus"
                    persistent-hint
                    required
                    type="number"
                    @input="v$.total_daily_amount.$touch"
                    @blur="v$.total_daily_amount.$touch"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model.number="state.treatment_length"
                    :error-messages="v$.treatment_length.$errors.map((e) => e.$message)"
                    label="Treatment length*"
                    hint="focus"
                    persistent-hint
                    required
                    type="number"
                    @input="v$.treatment_length.$touch"
                    @blur="v$.treatment_length.$touch"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model.number="state.hour_per_dosage"
                    :error-messages="v$.hour_per_dosage.$errors.map((e) => e.$message)"
                    label="Hour per dosage*"
                    hint="focus"
                    required
                    type="number"
                    @input="v$.hour_per_dosage.$touch"
                    @blur="v$.hour_per_dosage.$touch"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model.number="state.last_day_taking_pill"
                    :error-messages="v$.last_day_taking_pill.$errors.map((e) => e.$message)"
                    label="Last day of taking pill*"
                    hint="focus"
                    required
                    type="number"
                    @input="v$.last_day_taking_pill.$touch"
                    @blur="v$.last_day_taking_pill.$touch"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="state.status"
                    :error-messages="v$.status.$errors.map((e) => e.$message)"
                    label="Status*"
                    hint="focus"
                    required
                    @input="v$.status.$touch"
                    @blur="v$.status.$touch"
                  ></v-text-field>
                </v-col>
                <!--
                <v-col cols="12" sm="6">
                  <v-autocomplete
                    :items="[
                      'Skiing',
                      'Ice hockey',
                      'Soccer',
                      'Basketball',
                      'Hockey',
                      'Reading',
                      'Writing',
                      'Coding',
                      'Basejump',
                    ]"
                    label="Interests"
                    multiple
                  ></v-autocomplete>
                </v-col>
                -->
              </v-row>
            </v-container>
            <small>*indicates required field</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue-darken-1" variant="text" @click="clear(); dialog = false;;">
              Close
            </v-btn>
            <v-btn color="blue-darken-1" variant="text" @click="submit(); dialog = false;;">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-spacer></v-spacer>

      <v-btn
        :icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'"
        @click="show = !show"
      ></v-btn>
    </v-card-actions>

    <v-expand-transition>
      <div v-show="show">
        <v-divider></v-divider>

        <v-card-text>
          {{ medicine.directions_of_use }}
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script>
export default {
  inheritAttrs: false,
  data: () => ({
    show: false,
    dialog: false,
  }),
};
</script>

<script setup>
  import { useRoute } from "vue-router";
  import { useAlarmsStore } from "@/modules/alarms/stores/alarms";
  import { useMedicinesStore } from "../stores/medicines";
  import { computed, reactive } from "@vue/reactivity";
  import { onMounted, toRaw } from "vue";
  import { required, numeric } from "@vuelidate/validators";
  import { mustBeGreaterThan0 } from "@/core/utils/functions";
  import { useVuelidate } from "@vuelidate/core";

  const currentRoute = useRoute();
  const medicineUuid = currentRoute.query.medicineUuid;

  const medicinesStore = useMedicinesStore();
  const medicine = computed(() => toRaw(medicinesStore.medicine));
  const alarmsStore = useAlarmsStore();

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
    total_daily_amount:   { required, numeric, mustBeGreaterThan0 },
    treatment_length:     { required, numeric, mustBeGreaterThan0 },
    hour_per_dosage:      { required, numeric, mustBeGreaterThan0 },
    last_day_taking_pill: { required, numeric, mustBeGreaterThan0 },
    status:               { required }
  };

  const state = reactive({
    ...initialState,
  });

  const v$ = useVuelidate(rules, state);

  onMounted(() => {
    medicinesStore.getById(medicineUuid);
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

      await alarmsStore.addAlarm(request);
      await alarmsStore.getAll;
      clear();
    }
    else alert("Validation form failed!");
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
