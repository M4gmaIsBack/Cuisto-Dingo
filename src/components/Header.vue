<template>
  <header class="header">
    <div class="logo-container">
      <img src="@/assets/logo.png" alt="Cuisto'Dingo Logo" class="logo" />
      <span class="brand-name">Cuisto'Dingo</span>
    </div>

    <nav>
      <ul class="bouton-nav">
        <li><router-link to="/">Accueil</router-link></li>
        <li><router-link to="/articles">Articles</router-link></li>
        <li v-if="!isLoggedIn"><router-link to="/login">Connexion</router-link></li>
        <li v-if="!isLoggedIn"><router-link to="/register">Inscription</router-link></li>

        <li v-if="isLoggedIn" class="user-menu">
          <div class="user-profile" @click="toggleProfileMenu">
            <img :src="userAvatar" alt="User Avatar" class="user-avatar" />
            <span class="user-name">{{ userName }}</span>
          </div>
          <ul v-if="profileMenuVisible" class="dropdown-menu">
            <li><router-link to="/profile">Profil</router-link></li>
            <li><a @click="logout">Déconnexion</a></li>
          </ul>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const user = ref({
  name: localStorage.getItem("currentUser") ? JSON.parse(localStorage.getItem("currentUser")).username : null,
  avatar: localStorage.getItem("currentUser") ? JSON.parse(localStorage.getItem("currentUser")).image : null,
});

const isLoggedIn = computed(() => !!localStorage.getItem("token"));
const userName = computed(() => user.value?.name || "Utilisateur");
const userAvatar = computed(() => user.value?.avatar || "@/assets/logo.png");

const profileMenuVisible = ref(false);

const toggleProfileMenu = () => {
  profileMenuVisible.value = !profileMenuVisible.value;
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("currentUser");
  user.value = null;
  alert("Vous êtes déconnecté.");
  window.location.reload();
};

onMounted(() => {
  document.title = "Cuisto'Dingo !"; // Titre de l'onglet
  const favicon = document.createElement("link");
  favicon.rel = "icon";
  favicon.type = "image/png";
  favicon.href = "@/assets/logo.png"; // Chemin vers votre logo
  document.head.appendChild(favicon);
});
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

.bouton-nav {
  list-style: none;
  display: flex;
  gap: 20px;
  margin: 0;
  padding: 0;
  justify-content: center;
  align-items: center;
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

.user-menu {
  position: relative;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.user-avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.user-name {
  font-size: 1rem;
  font-weight: bold;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  display: flex;
  flex-direction: column;
  right: 0;
  background: white;
  color: black;
  list-style: none;
  padding: 5px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.dropdown-menu li {
  margin: 0;
  padding: 8px 15px;
}

.dropdown-menu li a {
  color: #333;
  text-decoration: none;
  display: block;
  font-size: 0.9rem;
}

.dropdown-menu li a:hover {
  background: #ffe0b2;
  color: #ff5722;
  border-radius: 5px;
}
</style>
