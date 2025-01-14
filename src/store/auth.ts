// src/store/auth.ts

import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    currentUser: ref(null),  // Utilisateur connecté
    token: ref(localStorage.getItem('token') || null),  // Token JWT persistant
  }),

  actions: {
    // Fonction pour la connexion
    async login(username: string, password: string) {
      try {
        const response = await axios.post('https://realword-api.nouwillcode.com/users/login', {
          username,
          password,
        });
        this.currentUser = response.data.user;
        this.token = response.data.token;
        localStorage.setItem('token', this.token);  // Stocker le token dans le localStorage
      } catch (error) {
        console.error('Erreur de connexion:', error);
      }
    },

    // Fonction pour la déconnexion
    logout() {
      this.currentUser = null;
      this.token = null;
      localStorage.removeItem('token');
    },

    // Vérifier si l'utilisateur est connecté
    isAuthenticated() {
      return this.token !== null;
    }
  },
});
