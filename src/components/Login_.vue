<template>
  <div>
    <form @submit.prevent="login">
      <input v-model="username" type="text" placeholder="Nom d'utilisateur" required />
      <input v-model="password" type="password" placeholder="Mot de passe" required />
      <button type="submit">Se connecter</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/store/auth';  // Import du store Pinia

const authStore = useAuthStore();  // Utilisation du store d'authentification
const username = ref('');
const password = ref('');

// Fonction de connexion
const login = async () => {
  await authStore.login(username.value, password.value);
  if (authStore.currentUser) {
    router.push('/');  // Redirection vers la page d'accueil si la connexion réussit
  }
};
</script>
