import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    currentUser: ref(null),
    token: ref(localStorage.getItem('token') || null),
  }),

  actions: {
    async login(email: string, password: string) {
      try {
        const response = await axios.post('https://realword-api.nouwillcode.com/api/users/login', {
          user: {
            email,
            password,
          },
        });

        this.currentUser = response.data.user;
        this.token = response.data.user.token;

        localStorage.setItem('token', this.token);
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      } catch (error) {
        console.error('Erreur de connexion :', error.response?.data || error.message);
        throw new Error('Impossible de se connecter. Vérifiez vos identifiants.');
      }
    },

    reload() {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('currentUser');

      if (token && user) {
        this.token = token;
        this.currentUser = JSON.parse(user);
        console.log('Données rechargées depuis localStorage :', this.currentUser);
      } else {
        this.logout();
      }
    },

    logout() {
      this.currentUser = null;
      this.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
    },

    isAuthenticated() {
      return this.token !== null;
    },
  },
});
