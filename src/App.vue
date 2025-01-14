<template>
  <div>
    <nav>
      <ul>
        <li><router-link to="/">Accueil</router-link></li>
        <li><router-link to="/articles">Articles</router-link></li>
        <li v-if="!isLoggedIn"><router-link to="/login">Connexion</router-link></li>
        <li v-if="!isLoggedIn"><router-link to="/register">Inscription</router-link></li>
        <li v-if="isLoggedIn"><a @click="logout">Déconnexion</a></li>
      </ul>
    </nav>
    <router-view />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const isLoggedIn = ref(false); // État réactif pour suivre la connexion

// Vérifie si un token existe au démarrage
onMounted(() => {
  isLoggedIn.value = !!localStorage.getItem('token');
});

// Fonction de déconnexion
const logout = () => {
  localStorage.removeItem('token');
  isLoggedIn.value = false; // Mise à jour de l'état
  alert('Vous êtes déconnecté.');
};
</script>
