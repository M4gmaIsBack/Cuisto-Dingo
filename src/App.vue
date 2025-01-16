<template>
  <div>
    <Header />

    <router-view />
  </div>
</template>

<script setup>
import Header from "@/components/Header.vue";
</script>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #fdfdfd;
}
</style>
