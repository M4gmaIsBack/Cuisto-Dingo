<template>
    <div>
      <h1>Inscription</h1>
      <form @submit.prevent="registerUser">
        <input v-model="username" type="text" placeholder="Nom d'utilisateur" />
        <input v-model="email" type="email" placeholder="Email" />
        <input v-model="password" type="password" placeholder="Mot de passe" />
        <button type="submit">S'inscrire</button>
      </form>
      <p v-if="error" style="color: red;">{{ error }}</p>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import api from '../api/axios'; // Assurez-vous que l'instance Axios est correctement configurée
  
  const username = ref('');
  const email = ref('');
  const password = ref('');
  const error = ref('');
  
  // Fonction pour s'inscrire
  const registerUser = async () => {
    error.value = ''; // Réinitialiser les erreurs
    try {
      const response = await api.post('/users', {
        user: {
          username: username.value,
          email: email.value,
          password: password.value,
        },
      });
      console.log('Utilisateur créé avec succès :', response.data);
      alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
    } catch (err) {
      console.error('Erreur lors de l\'inscription :', err);
      if (err.response?.data?.errors) {
        // Format des erreurs retournées par l'API
        error.value = Object.entries(err.response.data.errors)
          .map(([key, value]) => `${key} : ${value}`)
          .join(', ');
      } else {
        error.value = 'Erreur lors de la création de l\'utilisateur.';
      }
    }
  };
  </script>
  