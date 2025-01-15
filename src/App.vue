<template>
  <div>
    <!-- Intégration du Header -->
    <Header />

    <!-- Contenu principal (routes) -->
    <router-view />
  </div>
</template>

<script setup>
import Header from "@/components/Header.vue"; // Import du Header
</script>

<style>
/* Styles globaux si nécessaire */
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #fdfdfd;
}
</style>
