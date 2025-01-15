<template>
  <header class="header">
    <!-- Logo et Nom -->
    <div class="logo-container">
      <img src="@/assets/logo.png" alt="Cuisto'Dingo Logo" class="logo" />
      <span class="brand-name">Cuisto'Dingo</span>
    </div>

    <!-- Navigation -->
    <nav>
      <ul>
        <li><router-link to="/">Accueil</router-link></li>
        <li><router-link to="/articles">Articles</router-link></li>
        <li v-if="!isLoggedIn"><router-link to="/login">Connexion</router-link></li>
        <li v-if="!isLoggedIn"><router-link to="/register">Inscription</router-link></li>
        <li v-if="isLoggedIn"><a @click="logout">Déconnexion</a></li>
      </ul>
    </nav>
  </header>
</template>

<script setup>
import { ref, onMounted } from "vue";

const isLoggedIn = ref(false);

// Vérifie si un token existe au démarrage
onMounted(() => {
  isLoggedIn.value = !!localStorage.getItem("token");
});

// Fonction de déconnexion
const logout = () => {
  localStorage.removeItem("token");
  isLoggedIn.value = false;
  alert("Vous êtes déconnecté.");
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ff5722;
  padding: 10px 20px;
  color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo {
  max-width: 40px;
  height: auto;
}

.brand-name {
  font-size: 1.5rem;
  font-weight: bold;
}

nav ul {
  list-style: none;
  display: flex;
  gap: 20px;
  margin: 0;
  padding: 0;
}

nav ul li a {
  color: white;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s ease;
}

nav ul li a:hover {
  color: #ffe0b2;
}
</style>
