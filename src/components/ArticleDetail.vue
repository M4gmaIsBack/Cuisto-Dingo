<template>
  <div>
    <h1>{{ article?.title }}</h1>
    <p>{{ article?.body }}</p>
    <p>Auteur : {{ article?.author?.username }}</p>
    <p>❤️ {{ article?.favoritesCount }} like(s)</p>
    <button
      @click="toggleFavorite"
      :disabled="article?.author?.username === currentUser?.username"
    >
      {{ article?.favorited ? 'Retirer des favoris' : 'Ajouter aux favoris' }}
    </button>

    <h2>Commentaires</h2>
    <ul>
      <li v-for="comment in comments" :key="comment.id">
        <p><strong>{{ comment.author.username }}</strong> : {{ comment.body }}</p>
        <p>{{ new Date(comment.createdAt).toLocaleString() }}</p>
        <button v-if="comment.author.username === currentUser?.username" @click="deleteComment(comment.id)">
          Supprimer
        </button>
      </li>
    </ul>

    <textarea v-model="newComment" placeholder="Écrivez un commentaire..."></textarea>
    <button @click="addComment">Ajouter un commentaire</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '../api/axios';
import { currentUser } from '../store/auth';

const route = useRoute();
const article = ref(null);
const comments = ref([]);
const newComment = ref('');

// Fonction pour récupérer l'article
const fetchArticle = async () => {
  try {
    const response = await api.get(`/articles/${route.params.slug}`);
    article.value = response.data.article;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'article :', error);
  }
};

// Fonction pour récupérer les commentaires
const fetchComments = async () => {
  try {
    const response = await api.get(`/articles/${route.params.slug}/comments`);
    comments.value = response.data.comments;
  } catch (error) {
    console.error('Erreur lors de la récupération des commentaires :', error);
  }
};

// Fonction pour ajouter un commentaire
const addComment = async () => {
  if (!newComment.value.trim()) return; // Empêche les commentaires vides
  try {
    const response = await api.post(
      `/articles/${route.params.slug}/comments`,
      { comment: { body: newComment.value } },
      { headers: { Authorization: `Token ${localStorage.getItem('token')}` } }
    );
    comments.value.push(response.data.comment); // Ajoute le nouveau commentaire à la liste
    newComment.value = ''; // Réinitialise le champ de saisie
  } catch (error) {
    console.error('Erreur lors de l\'ajout du commentaire :', error);
  }
};

// Fonction pour supprimer un commentaire
const deleteComment = async (id) => {
  try {
    await api.delete(`/articles/${route.params.slug}/comments/${id}`, {
      headers: { Authorization: `Token ${localStorage.getItem('token')}` },
    });
    comments.value = comments.value.filter(comment => comment.id !== id); // Supprime le commentaire localement
  } catch (error) {
    console.error('Erreur lors de la suppression du commentaire :', error);
  }
};

// Fonction pour liker ou disliker l'article
const toggleFavorite = async () => {
  try {
    if (article.value.favorited) {
      const response = await api.delete(`/articles/${article.value.slug}/favorite`, {
        headers: { Authorization: `Token ${localStorage.getItem('token')}` },
      });
      article.value = response.data.article;
    } else {
      const response = await api.post(`/articles/${article.value.slug}/favorite`, {}, {
        headers: { Authorization: `Token ${localStorage.getItem('token')}` },
      });
      article.value = response.data.article;
    }
  } catch (error) {
    console.error('Erreur lors du changement de favoris :', error);
  }
};

// Charger l'article et les commentaires au chargement de la page
onMounted(() => {
  fetchArticle();
  fetchComments();
});
</script>
