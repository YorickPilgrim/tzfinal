<template>
  <div class="wrapper">
    <router-view />
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue"
import TZheader from "./components/TZheader.vue"
import { RouterLink, RouterView } from "vue-router"
</script>
<style scoped>
.wrapper {
  padding-bottom: 30px;
}
</style>
