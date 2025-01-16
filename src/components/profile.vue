<template>
  <div class="profile-page">
    <div class="profile-card">
      <!-- Logo -->
      <img :src="userAvatar" alt="Avatar utilisateur" class="profile-avatar" />

      <!-- Formulaire pour mettre à jour les informations -->
      <form @submit.prevent="updateProfile">
        <div class="form-group">
          <label for="username">Nom d'utilisateur</label>
          <input v-model="username" id="username" type="text" />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input v-model="email" id="email" type="email" />
        </div>
        <div class="form-group">
          <label for="bio">Bio</label>
          <textarea v-model="bio" id="bio"></textarea>
        </div>
        <div class="form-group">
          <label for="avatar">Lien de l'image</label>
          <input v-model="avatar" id="avatar" type="text" />
        </div>

        <button type="submit" class="save-button">Enregistrer</button>
      </form>

      <!-- Bouton supprimer -->
      <button @click="deleteAccount" class="delete-button">Supprimer mon compte</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import api from "../api/axios"; // Instance Axios configurée

const username = ref("");
const email = ref("");
const bio = ref("");
const avatar = ref("");

// Lien par défaut pour l'avatar
const defaultAvatar = "@/assets/logo.png";

// Computed property pour vérifier et afficher l'avatar
const userAvatar = computed(() => {
  return avatar.value && avatar.value.trim() !== "" ? avatar.value : defaultAvatar;
});

// Chargement des données utilisateur à partir de localStorage
const loadUserData = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (currentUser) {
    username.value = currentUser.username || "";
    email.value = currentUser.email || "";
    bio.value = currentUser.bio || "";
    avatar.value = currentUser.image || "";
  }
};

// Charger les données utilisateur au démarrage
loadUserData();

// Méthode pour mettre à jour le profil
const updateProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token d'authentification manquant");
    }

    const response = await api.put(
      "/api/user",
      {
        user: {
          username: username.value,
          email: email.value,
          bio: bio.value,
          image: avatar.value,
        },
      },
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );

    console.log("Profil mis à jour :", response.data);
    alert("Profil mis à jour avec succès !");
    localStorage.setItem("currentUser", JSON.stringify(response.data.user));
    loadUserData(); // Recharge les données locales
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil :", error.response?.data || error.message);
    alert("Erreur lors de la mise à jour du profil.");
  }
};

// Méthode pour supprimer le compte
const deleteAccount = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token d'authentification manquant");
    }

    const email = localStorage.getItem("currentUser")
      ? JSON.parse(localStorage.getItem("currentUser")).email
      : null;

    if (!email) {
      throw new Error("Email de l'utilisateur introuvable");
    }

    const response = await api.delete(`/api/users/${email}`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    console.log("Compte supprimé :", response.data);
    alert("Votre compte a été supprimé avec succès !");
    localStorage.clear();
    window.location.href = "/register";
  } catch (error) {
    console.error("Erreur lors de la suppression du compte :", error.response?.data || error.message);
    alert("Erreur lors de la suppression du compte.");
  }
};
</script>


<style scoped>
/* Page de profil */
.profile-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(to bottom, #ff5722, #ff8a50);
  font-family: "Arial", sans-serif;
}

/* Carte de profil */
.profile-card {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

/* Avatar utilisateur */
.profile-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 20px;
  border: 2px solid #ff5722;
}

/* Formulaire */
.form-group {
  margin-bottom: 15px;
  text-align: left;
}

.form-group label {
  display: block;
  font-size: 0.9rem;
  margin-bottom: 5px;
  color: #333;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  outline: none;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #ff5722;
}

textarea {
  resize: none;
  height: 80px;
}

/* Boutons */
.save-button {
  background: #ff5722;
  color: white;
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  margin-top: 15px;
  transition: all 0.3s ease;
}

.save-button:hover {
  background: #e64a19;
}

.delete-button {
  background: #ff5252;
  color: white;
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  margin-top: 15px;
  transition: all 0.3s ease;
}

.delete-button:hover {
  background: #d32f2f;
}
</style>
