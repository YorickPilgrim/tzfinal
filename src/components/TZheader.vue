<template>
  <header>
    <div class="icon" @click="tabOne">
      <div><img src="../assets/photo/OBJECTS.png" alt="" /></div>
    </div>

    <div to="/favorites" class="fav" @click="tabTwo"></div>
  </header>
</template>
<script setup>
import { ref } from "vue"
const tab = ref("")
const tabOne = () => {
  tab = 1
}
const tabTwo = () => {
  tab = 2
}
</script>
<style scoped>
header {
  background-color: black;
  padding: 20px 10%;
  display: flex;
  justify-content: space-between;
  color: white;
}
.icon img {
  width: 140px;
}
.fav {
  align-self: center;
}
.fav::before {
  content: "";
  padding: 1px 9.5px;
  background: url(../assets/photo/fav.png) no-repeat;
  margin-right: 5px;
  background-size: cover;
}
/* .fav img {
  width: 20px;
  padding-right: 10px;
} */
</style>
