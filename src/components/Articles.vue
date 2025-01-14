<template>
  <div>
    <h1>Tous les articles</h1>
    <ul>
      <li v-for="article in articles" :key="article.slug">
        <h2>
          <router-link :to="`/articles/${article.slug}`">{{ article.title }}</router-link>
        </h2>
        <p>{{ article.description }}</p>
        <p>Auteur : {{ article.author.username }}</p>
        <p>❤️ {{ article.favoritesCount }} like(s)</p>
        <button
          @click="toggleFavorite(article)"
          :disabled="article.author.username === currentUser?.username"
        >
          {{ article.favorited ? 'Retirer des favoris' : 'Ajouter aux favoris' }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../api/axios';
import { currentUser } from '../store/auth';

const articles = ref([]); // Liste des articles

// Fonction pour récupérer les articles depuis l'API
const fetchArticles = async () => {
  try {
    const response = await api.get('/articles', {
      headers: { Authorization: `Token ${localStorage.getItem('token')}` }, // Ajout du token
    });
    articles.value = response.data.articles.map(article => ({
      ...article,
      favorited: !!article.favorited, // Assure que favorited est un booléen
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des articles :', error);
  }
};

// Fonction pour ajouter ou retirer des favoris
const toggleFavorite = async (article) => {
  try {
    if (article.author.username === currentUser?.username) {
      alert("Impossible de liker votre propre article.");
      return;
    }

    if (article.favorited) {
      // Retirer des favoris
      const response = await api.delete(`/articles/${article.slug}/favorite`, {
        headers: { Authorization: `Token ${localStorage.getItem('token')}` },
      });
      article.favorited = false;
      article.favoritesCount = response.data.article.favoritesCount;
    } else {
      // Ajouter aux favoris
      const response = await api.post(`/articles/${article.slug}/favorite`, {}, {
        headers: { Authorization: `Token ${localStorage.getItem('token')}` },
      });
      article.favorited = true;
      article.favoritesCount = response.data.article.favoritesCount;
    }
  } catch (error) {
    console.error('Erreur lors du changement de favoris :', error);
  }
};

// Recharger les articles au chargement de la page
onMounted(fetchArticles);
</script>
