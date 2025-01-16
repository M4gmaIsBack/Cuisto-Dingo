import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Importez le routeur
import { createPinia } from 'pinia';

const app = createApp(App);

app.use(router); // Ajoutez le routeur
app.use(createPinia()); // Ajoutez Pinia
app.mount('#app');
