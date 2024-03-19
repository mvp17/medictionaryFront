<template>
  <h1>Alarms</h1>
  <v-table fixed-header>
    <thead>
      <tr>
        <th class="text-center">Time taking pill</th>
        <th class="text-center">Name</th>
        <th class="text-center">Total daily amount</th>
        <th class="text-center">Treatment length</th>
        <th class="text-center">Hour per dosage</th>
        <th class="text-center">Last day of taking the pill</th>
        <th class="text-center">Status</th>
      </tr>
    </thead>
    <tbody></tbody>
  </v-table>
</template>

<script>
export default {
  inheritAttrs: false,
};
</script>

<script setup>
  import { useAlarmsStore } from "../stores/alarms";
  import { computed } from "@vue/reactivity";
  import { onMounted } from "vue";

  const alarmsStore = useAlarmsStore();
  const alarms = computed(() => alarmsStore.alarms);

  onMounted(() => {
    //getAlarms();
  });

  function getAlarms () {
    alarmsStore.getAll();
  }
</script>