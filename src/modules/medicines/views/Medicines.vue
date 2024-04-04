<template>
    <h1>Medicines</h1>
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
              v-model="state.description"
              :error-messages="v$.description.$errors.map((e) => e.$message)"
              :counter="10"
              label="Description"
              required
              @input="v$.description.$touch"
              @blur="v$.description.$touch"
            ></v-text-field>

            <v-text-field
              v-model="state.side_effects"
              :error-messages="v$.side_effects.$errors.map((e) => e.$message)"
              :counter="10"
              label="Side effects"
              required
              @input="v$.side_effects.$touch"
              @blur="v$.side_effects.$touch"
            ></v-text-field>

            <v-text-field
              v-model.number="state.total_daily_dosage"
              :error-messages="v$.total_daily_dosage.$errors.map((e) => e.$message)"
              :counter="10"
              label="Total daily dosage"
              required
              type="number"
              @input="v$.total_daily_dosage.$touch"
              @blur="v$.total_daily_dosage.$touch"
            ></v-text-field>

            <v-textarea 
              v-model="state.directions_of_use"
              :error-messages="v$.directions_of_use.$errors.map((e) => e.$message)"
              :counter="10"
              label="Directions of use" 
              variant="outlined"
              required
              @input="v$.directions_of_use.$touch"
              @blur="v$.directions_of_use.$touch"
            ></v-textarea>

            <v-btn color="success" class="me-4" @click="submit"> submit </v-btn>
            <v-btn color="error" @click="clear"> clear </v-btn>
        </form>
        </v-col>
        <v-col>
        <v-table fixed-header>
            <thead>
            <tr>
                <th class="text-center">Name</th>
                <th class="text-center">Description</th>
                <th class="text-center">Side effects</th>
                <th class="text-center">Total Daily Dosage</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="medicine in medicines" :key="medicine.uuid">
                <td>{{ medicine.name }}</td>
                <td>{{ medicine.description }}</td>
                <td>{{ medicine.side_effects }}</td>
                <td>{{ medicine.total_daily_dosage }}</td>
                <td>
                    <v-btn color="warning" class="me-4" @click="editMedicine(medicine)"> edit </v-btn>
                    <v-btn color="error" class="me-4" @click="deleteMedicine(medicine.uuid)"> delete </v-btn>
                </td>
            </tr>
            </tbody>
        </v-table>
        </v-col>
    </v-row>
</template>
  
  
<script setup>
    import { useMedicinesStore } from "../stores/medicines";
    import { computed, reactive } from "@vue/reactivity";
    import { useVuelidate } from "@vuelidate/core";
    import { onMounted } from "vue";
    import { required, numeric } from "@vuelidate/validators";
    import { mustBeGreaterThan0 } from "@/core/utils/functions";
  
    const medicinesStore = useMedicinesStore();
    const medicines = computed(() => medicinesStore.medicines);
  
    const initialState = {
      name: "",
      description: "",
      side_effects: "",
      total_daily_dosage: 0,
      directions_of_use: ""
    };
  
    const rules = {
      name:               { required },
      description:        { required },
      side_effects:       { required },
      total_daily_dosage: { required, numeric, mustBeGreaterThan0 },
      directions_of_use:  { required }
    };
  
    const state = reactive({
      ...initialState,
    });
  
    const v$ = useVuelidate(rules, state);
    let medicineId = "";
  
    onMounted(async () => {
        await medicinesStore.getAll;
    });
  
    async function submit() {
      const result = await v$.value.$validate();
      const request = {
        name: "",
        description: "",
        side_effects: "",
        total_daily_dosage: 0,
        directions_of_use: ""
      }
  
      if (result) {
        request.name               = state.name;
        request.description        = state.description;
        request.side_effects       = state.side_effects;
        request.total_daily_dosage = state.total_daily_dosage;
        request.directions_of_use  = state.directions_of_use;
  
        if (medicineId !== "") {
          await medicinesStore.updateMedicine(medicineId, request);
          medicineId = "";
        }
        else
          await medicinesStore.addMedicine(request);
  
        await medicinesStore.getAll;
        clear();
      }
      else alert("Validation form failed!");
    }
  
    async function editMedicine(/** @type {{ uuid: string, 
                                             name: string, 
                                             description: string, 
                                             side_effects: string,
                                             total_daily_dosage: number
                                             directions_of_use: string
                                          }} */ 
                                        medicine) {
      state.name               = medicine.name;
      state.description        = medicine.description;
      state.side_effects       = medicine.side_effects;
      state.total_daily_dosage = medicine.total_daily_dosage;
      state.directions_of_use  = medicine.directions_of_use;
      medicineId               = medicine.uuid;
    }
  
    async function deleteMedicine(/** @type { string } */ uuid) {
      await medicinesStore.removeMedicine(uuid);
    }
  
    function clear() {
      v$.value.$reset();
      state.name               = "";
      state.description        = "";
      state.side_effects       = "";
      state.total_daily_dosage = 0;
      state.directions_of_use  = "";
    }
</script>
