<template>
  <div class="login-page">
    <div class="left-section">
      <div class="form-container">
        <h3 class="form-title">Connexion</h3>
        <form @submit.prevent="login">
          <div class="form-group">
            <input v-model="email" type="email" placeholder="Email" required />
          </div>
          <div class="form-group">
            <input v-model="password" type="password" placeholder="Mot de passe" required />
          </div>
          <button type="submit" class="form-button">Se connecter</button>
        </form>
        <p v-if="error" class="error-message">{{ error }}</p>
      </div>
    </div>

    <div class="right-section">
      <img src="@/assets/logo2.png" alt="Cuisto'Dingo Logo" class="logo" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/store/auth'; // Importez le store Pinia

const authStore = useAuthStore();
const email = ref('');
const password = ref('');
const error = ref('');

// Fonction de connexion
const login = async () => {
  try {
    await authStore.login(email.value, password.value);
    alert('Connexion réussie !');

    // Rechargement complet de la page pour recharger l'état
    window.location.href = '/'; // Redirige vers la page d'accueil
  } catch (err) {
    error.value = 'Échec de la connexion. Vérifiez vos identifiants.';
    console.error(err);
  }
};
</script>




<style scoped>
.login-page {
  display: flex;
  height: 100vh;
  font-family: 'Arial', sans-serif;
  background: linear-gradient(to bottom, rgb(255, 87, 34), rgb(235, 135, 59));
}

.left-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
}

.form-container {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.form-title {
  font-size: 1.8rem;
  margin-bottom: 20px;
  color: #333;
}

.form-group {
  margin-bottom: 15px;
}

.form-group input {
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  outline: none;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  border-color: #ff7e5f;
}

.form-button {
  background: #ff7e5f;
  color: white;
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.form-button:hover {
  background: #ff5722;
}

.right-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo {
  max-width: 450px;
}

.error-message {
  margin-top: 15px;
  color: red;
  font-size: 0.9rem;
}
</style>
