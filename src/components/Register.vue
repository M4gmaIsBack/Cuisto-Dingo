<template>
  <div class="register-page">
    <div class="left-section">
      <img src="@/assets/logo2.png" alt="Cuisto'Dingo Logo" class="logo" />
      <p class="left-description">
        Vous faites deja partie de la team des dingo ! Alors clique sur le bouton
      </p>
      <button class="about-button">Connexion</button>
    </div>

    <div class="right-section">
      <div class="form-container">
        <h3 class="form-title">Inscription</h3>
        <form @submit.prevent="registerUser">
          <div class="form-group">
            <input v-model="username" type="text" placeholder="Nom d'utilisateur" />
          </div>
          <div class="form-group">
            <input v-model="email" type="email" placeholder="Email" />
          </div>
          <div class="form-group">
            <input v-model="password" type="password" placeholder="Mot de passe" />
          </div>
          <button type="submit" class="form-button">S'inscrire</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '../api/axios'; // Assurez-vous que l'instance Axios est correctement configurée

const username = ref('');
const email = ref('');
const password = ref('');

const registerUser = async () => {
  try {
    console.log('Requête envoyée :', {
      user: {
        username: username.value,
        email: email.value,
        password: password.value,
      },
    });

    const response = await api.post('/api/users', {
      user: {
        username: username.value,
        email: email.value,
        password: password.value,
      },
    });

    console.log('Réponse de l\'API :', response.data);
    alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
  } catch (error) {
    console.error('Erreur lors de l\'inscription :', error.response?.data || error.message);
    alert('Erreur lors de l\'inscription. Veuillez réessayer.');
  }
};

</script>

<style scoped>
.register-page {
  display: flex;
  height: 100vh;
  font-family: 'Arial', sans-serif;
  background: linear-gradient(to bottom, rgb(255, 87, 34), rgb(235, 135, 59));
}

.left-section {

  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  padding: 20px;
  text-align: center;
}

.logo {
  max-width: 450px;
  margin-bottom: 20px;
}


.left-title {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.left-description {
  font-size: 1.2rem;
  margin-bottom: 20px;
  line-height: 1.5;
}

.about-button {
  background: white;
  color: #ff7e5f;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.about-button:hover {
  background: #ffe0b2;
  color: #ff5722;
}

.right-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
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
</style>
