<template>
  <div>
    <h1>
      <div v-for="number in myArray" :key="number">{{ number }}</div>
    </h1>
    <!-- <div><img v-for="fav in favmass" :src="fav" alt="" /></div> -->
  </div>
</template>
<script setup>
import { ref } from "vue"
// import { myArray } from "./TZmain.vue"
</script>
