
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';  // Import de Pinia

const app = createApp(App);

// Utilisation de Pinia et du routeur
app.use(createPinia());  // Ajout de Pinia pour la gestion de l'état
app.use(router);  // Utilisation du routeur
app.mount('#app');
