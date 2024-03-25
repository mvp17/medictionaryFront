<template>
  <h1>Search</h1>
  <v-container>
    <input type="text" v-model="input" placeholder="Search..." />
    <div
      class="item medicine"
      v-for="medicine in filteredMedicines"
      :key="medicine.name"
    >
      <p @click="detail(medicine.uuid)">
        <v-img
          src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
          height="200px"
          cover
        ></v-img>
        {{ medicine.name }}
        <v-tooltip activator="parent" location="end"
          >Click for details <v-icon icon="mdi-eye-outline"></v-icon
        ></v-tooltip>
      </p>
    </div>
    <div class="item error" v-if="input && !filteredMedicines.length">
      <p>No results found!</p>
    </div>
  </v-container>
</template>


<script setup>
  import { useRouter } from "vue-router";
  import { ref, toRaw, onMounted } from "vue";
  import { computed } from "@vue/reactivity";
  import { useMedicinesStore } from "../stores/medicines";

  const medicinesStore = useMedicinesStore();
  const medicines = computed(() => toRaw(medicinesStore.medicines));

  let input = ref("");
  const router = useRouter();

  onMounted(async () => {
    await medicinesStore.getAll;
  });

  const filteredMedicines = computed(() => {
    if (input.value)
      return medicines.value.filter(medicine =>
        medicine.name.toLowerCase().includes(input.value.toLowerCase())
      );
  });

  function detail(/** @type { string } */ uuid) {
    router.push({ path: "/detailed-medicine", query: { medicineUuid: uuid } });
  }
</script>

<style scoped>
  @import url("https://fonts.googleapis.com/css2?family=Montserrat&display=swap");

  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    font-family: "Montserrat", sans-serif;
  }

  body {
    padding: 20px;
    min-height: 100vh;
    background-color: rgb(234, 242, 255);
  }

  input {
    display: block;
    width: 450px;
    margin: 20px auto;
    padding: 10px 45px;
    background: white url("src/assets/search-icon.svg") no-repeat 15px center;
    background-size: 15px 15px;
    font-size: 16px;
    border: none;
    border-radius: 5px;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
      rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
  }

  .item {
    width: 450px;
    margin: 0 auto 10px auto;
    padding: 10px 20px;
    color: white;
    border-radius: 5px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,
      rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
  }

  .medicine {
    background-color: rgb(97, 62, 252);
    cursor: pointer;
    text-align: center;
  }

  .error {
    background-color: tomato;
  }
</style>
