import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    currentUser: ref(null), // Utilisateur connecté
    token: ref(localStorage.getItem('token') || null), // Token JWT persistant
  }),

  actions: {
    // Fonction pour la connexion
    async login(email: string, password: string) {
      try {
        const response = await axios.post('https://realword-api.nouwillcode.com/api/users/login', {
          user: {
            email,
            password,
          },
        });

        // Mise à jour des données utilisateur et du token
        this.currentUser = response.data.user;
        this.token = response.data.user.token;

        // Stocker les données dans le localStorage
        localStorage.setItem('token', this.token);
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      } catch (error) {
        console.error('Erreur de connexion :', error.response?.data || error.message);
        throw new Error('Impossible de se connecter. Vérifiez vos identifiants.');
      }
    },

    // Fonction pour recharger l'état utilisateur
    reload() {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('currentUser');

      if (token && user) {
        this.token = token;
        this.currentUser = JSON.parse(user);
        console.log('Données rechargées depuis localStorage :', this.currentUser);
      } else {
        this.logout(); // Déconnecter si les données sont invalides
      }
    },

    // Fonction pour la déconnexion
    logout() {
      this.currentUser = null;
      this.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
    },

    // Vérifier si l'utilisateur est connecté
    isAuthenticated() {
      return this.token !== null;
    },
  },
});
