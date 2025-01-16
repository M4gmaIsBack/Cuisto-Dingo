<template>
  <div class="articles-page">
    <!-- En-tête -->
    <header class="page-header">
      <h1>Nos Recettes</h1>
      <div class="search-filter">
        <input
          v-model="search"
          type="text"
          placeholder="Rechercher une recette..."
        />
        <select v-model="selectedTag">
          <option value="">Tous les tags</option>
          <option v-for="tag in tags" :key="tag" :value="tag">
            {{ tag }}
          </option>
        </select>
      </div>
    </header>

    <!-- Liste des articles -->
    <div class="articles-list">
      <div
        class="article-card"
        v-for="article in filteredArticles"
        :key="article.slug"
      >
        <img
          src="@/assets/logo.png"
          alt="Image de la recette"
          class="article-image"
        />
        <div class="article-content">
          <h2 class="article-title">{{ article.title }}</h2>
          <p class="article-description">{{ article.description }}</p>
          <div class="article-meta">
            <img
              :src="article.author.image || '@/assets/logo.png'"
              alt="Auteur"
              class="author-avatar"
            />
            <span class="author-name">{{ article.author.username }}</span>
            <span class="article-date"> - {{ formatDate(article.createdAt) }}</span>
          </div>
        </div>
        <div class="article-actions">
          <button @click="toggleFavorite(article)" class="like-button">
            {{ article.favorited ? "💔" : "❤️" }}
          </button>
          <button @click="openModal(article)" class="read-more">
            Lire la suite
          </button>
          <button @click="deleteRecipe(article.slug)" class="delete-recipe-button">
            Supprimer
          </button>
        </div>
      </div>
    </div>

    <!-- Formulaire de création -->
    <div class="create-recipe-form">
      <h2>Créer une recette</h2>
      <form @submit.prevent="createRecipe">
        <div class="form-group">
          <label for="title">Titre</label>
          <input v-model="newRecipe.title" id="title" type="text" required placeholder="Titre"/>
        </div>
        <div class="form-group">
          <label for="description">Description</label>
          <textarea v-model="newRecipe.description" id="description" required placeholder="Description"></textarea>
        </div>
        <div class="form-group">
          <label for="tags">Tags</label>
          <input
            v-model="newRecipe.tags"
            id="tags"
            type="text"
            placeholder="Ex : rapide, dessert, etc."
          />
        </div>
        <div class="form-group">
          <label for="body">Contenu</label>
          <textarea v-model="newRecipe.body" id="body" required placeholder="Body"></textarea>
        </div>
        <button type="submit" class="create-button">Créer</button>
      </form>
    </div>

    <!-- Modale pour les détails -->
    <div v-if="selectedArticle" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <img
          src="@/assets/logo.png"
          alt="Image de la recette"
          class="modal-image"
        />
        <h2 class="modal-title">{{ selectedArticle.title }}</h2>
        <p class="modal-date">Créé le : {{ formatDate(selectedArticle.createdAt) }}</p>
        <div class="author-details">
          <img
            :src="selectedArticle.author.image || '@/assets/logo.png'"
            alt="Auteur"
            class="author-avatar"
          />
          <span class="author-name">{{ selectedArticle.author.username }}</span>
          <!-- Bouton Suivre/Ne plus suivre pour l'auteur -->
          <button @click="toggleFollow(selectedArticle.author.username)" class="follow-button">
            {{ selectedArticle.author.following ? "Ne plus suivre" : "Suivre" }}
          </button>

          <!-- Bouton Suivre/Ne plus suivre pour les commentaires -->
          <button
            v-for="comment in comments"
            @click="toggleFollow(comment.author.username)"
            class="follow-button"
          >
            {{ comment.author.following ? "Ne plus suivre" : "Suivre" }}
          </button>

        </div>
        <p class="modal-description">{{ selectedArticle.body }}</p>

        <!-- Commentaires -->
        <div class="comments-section">
          <h3>Commentaires</h3>
          <ul>
            <li v-for="comment in comments" :key="comment.id" class="comment">
              <div class="comment-header">
                <img
                  :src="comment.author.image || '@/assets/logo.png'"
                  alt="Commentateur"
                  class="comment-avatar"
                />
                <span class="comment-author">{{ comment.author.username }}</span>
                <span class="comment-date"> - {{ formatDate(comment.createdAt) }}</span>
                <button @click="toggleFollow(comment.author.username)" class="follow-button">
                  {{ comment.author.following ? "Ne plus suivre" : "Suivre" }}
                </button>
              </div>
              <p class="comment-body">{{ comment.body }}</p>
              <button @click="deleteComment(comment.id)" class="delete-comment-button">
                Supprimer
              </button>
            </li>
          </ul>
          <form @submit.prevent="addComment" class="comment-form">
            <textarea
              v-model="newComment"
              placeholder="Ajouter un commentaire..."
              class="comment-input"
            ></textarea>
            <button type="submit" class="add-comment-button">Ajouter</button>
          </form>
        </div>
        <button @click="closeModal" class="close-modal">Fermer</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import api from "../api/axios";

const articles = ref([]);
const tags = ref([]);
const search = ref("");
const selectedTag = ref("");
const selectedArticle = ref(null);
const comments = ref([]);
const newComment = ref("");
const newRecipe = ref({
  title: "",
  description: "",
  tags: "",
  body: "",
  image: "",
});

// Charger les articles
const loadArticles = async () => {
  try {
    const response = await api.get("/api/articles");
    articles.value = response.data.articles;
  } catch (error) {
    console.error("Erreur lors du chargement des articles :", error);
  }
};

// Charger les tags
const loadTags = async () => {
  try {
    const response = await api.get("/api/tags");
    tags.value = response.data.tags;
  } catch (error) {
    console.error("Erreur lors du chargement des tags :", error);
  }
};

// Articles filtrés
const filteredArticles = computed(() => {
  return articles.value.filter(
    (article) =>
      (!selectedTag.value || article.tagList.includes(selectedTag.value)) &&
      article.title.toLowerCase().includes(search.value.toLowerCase())
  );
});

// Ouvrir et fermer la modale
const openModal = async (article) => {
  selectedArticle.value = article;
  loadComments(article.slug);
};
const closeModal = () => {
  selectedArticle.value = null;
  comments.value = [];
};

// Charger les commentaires
const loadComments = async (slug) => {
  try {
    const response = await api.get(`/api/articles/${slug}/comments`);
    comments.value = response.data.comments;
  } catch (error) {
    console.error("Erreur lors du chargement des commentaires :", error);
  }
};

// Ajouter un commentaire
const addComment = async () => {
  if (!newComment.value.trim()) return;
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Non autorisé");
    const response = await api.post(
      `/api/articles/${selectedArticle.value.slug}/comments`,
      { comment: { body: newComment.value } },
      { headers: { Authorization: `Token ${token}` } }
    );
    comments.value.push(response.data.comment);
    newComment.value = "";
  } catch (error) {
    console.error("Erreur lors de l'ajout du commentaire :", error);
  }
};

// Supprimer un commentaire
const deleteComment = async (commentId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Non autorisé");
    await api.delete(`/api/articles/${selectedArticle.value.slug}/comments/${commentId}`, {
      headers: { Authorization: `Token ${token}` },
    });
    comments.value = comments.value.filter((comment) => comment.id !== commentId);
  } catch (error) {
    console.error("Erreur lors de la suppression du commentaire :", error);
  }
};

// Créer une recette
const createRecipe = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Non autorisé");
    const payload = {
      article: {
        title: newRecipe.value.title,
        description: newRecipe.value.description,
        body: newRecipe.value.body,
        image: newRecipe.value.image,
        tagList: newRecipe.value.tags.split(",").map((tag) => tag.trim()),
      },
    };
    const response = await api.post("/api/articles", payload, {
      headers: { Authorization: `Token ${token}` },
    });
    articles.value.unshift(response.data.article);
    newRecipe.value = { title: "", description: "", tags: "", body: "", image: "" };
  } catch (error) {
    console.error("Erreur lors de la création de la recette :", error);
  }
};

// Supprimer une recette
const deleteRecipe = async (slug) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Non autorisé");
    await api.delete(`/api/articles/${slug}`, {
      headers: { Authorization: `Token ${token}` },
    });
    articles.value = articles.value.filter((article) => article.slug !== slug);
  } catch (error) {
    console.error("Erreur lors de la suppression de la recette :", error);
  }
};

// Suivre/Ne plus suivre un utilisateur
// Suivre/Ne plus suivre un utilisateur
const toggleFollow = async (username) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Non autorisé");

    // Vérifier si on est dans la modale (article sélectionné)
    let user;
    if (selectedArticle.value && selectedArticle.value.author.username === username) {
      user = selectedArticle.value.author;
    } else {
      // Sinon, chercher dans les articles
      user = articles.value.find(
        (article) => article.author.username === username
      )?.author;
    }

    if (!user) throw new Error("Utilisateur introuvable");

    if (user.following) {
      await api.delete(`/api/profiles/${username}/follow`, {
        headers: { Authorization: `Token ${token}` },
      });
    } else {
      await api.post(`/api/profiles/${username}/follow`, {}, {
        headers: { Authorization: `Token ${token}` },
      });
    }
    user.following = !user.following;
  } catch (error) {
    console.error("Erreur lors du suivi de l'utilisateur :", error);
  }
};


// Gestion des favoris
const toggleFavorite = async (article) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Non autorisé");
    if (article.favorited) {
      await api.delete(`/api/articles/${article.slug}/favorite`, {
        headers: { Authorization: `Token ${token}` },
      });
    } else {
      await api.post(`/api/articles/${article.slug}/favorite`, {}, {
        headers: { Authorization: `Token ${token}` },
      });
    }
    article.favorited = !article.favorited;
  } catch (error) {
    console.error("Erreur lors de la gestion des favoris :", error);
  }
};

// Formater la date
const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("fr-FR", options);
};

// Charger les articles et les tags au démarrage
onMounted(() => {
  loadArticles();
  loadTags();
});
</script>

<style scoped>
.articles-page {
  padding: 20px;
  background: linear-gradient(to bottom, #ff5722, #ff8a50);
  color: white;
}

.page-header {
  text-align: center;
  margin-bottom: 20px;
}

.page-header h1 {
  font-size: 2.5rem;
}

.search-filter {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.articles-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.article-card {
  background: white;
  color: black;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  padding: 15px;
  position: relative;
}

.article-meta {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.author-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover;
}

.author-name {
  font-weight: bold;
  margin-right: 5px;
}

.article-date {
  font-size: 0.9rem;
  color: gray;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 600px;
  max-height: 80vh;
  overflow-y: auto;
}

.comment-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.comment-avatar {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover;
}

.comment-author {
  font-weight: bold;
  margin-right: 5px;
}

.comment-date {
  font-size: 0.9rem;
  color: gray;
}

.articles-page {
  padding: 20px;
  background: linear-gradient(to bottom, #ff5722, #ff8a50);
  color: white;
}

.page-header {
  text-align: center;
  margin-bottom: 20px;
}

.page-header h1 {
  font-size: 2.5rem;
}

.search-filter {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.articles-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}
img {
  max-width: 100px;
 
}
.article-card {
  background: white;
  color: black;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  padding: 15px;
  position: relative;
}

.modal-overlay {
  position: fixed;
  color: black;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 600px;
  max-height: 80vh;
  overflow-y: auto;
}

.article-actions {
  display: flex;
    gap: 20px;
    flex-direction: column;
}

.create-recipe-form {
  background: white;
  padding: 50PX;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  margin: 20px auto;
  max-width: 500px;
  text-align: center;
}

.create-recipe-form h2 {
  color: #ff5722;
  margin-bottom: 15px;
}

.create-recipe-form .form-group {
  margin-bottom: 15px;
  text-align: left;
}

/* Boutons généraux */
button {
  background-color: #ff5722; /* Couleur principale */
  color: white; /* Texte blanc */
  padding: 10px 20px; /* Espacement */
  font-size: 1rem; /* Taille de la police */
  font-weight: bold; /* Texte en gras */
  border: none; /* Suppression des bordures */
  border-radius: 25px; /* Coins arrondis */
  cursor: pointer; /* Curseur de clic */
  transition: all 0.3s ease; /* Transition fluide */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Ombre légère */
}

/* Effet hover (au survol) */
button:hover {
  background-color: #e64a19; /* Couleur plus sombre au survol */
  transform: translateY(-2px); /* Légère élévation */
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2); /* Ombre accentuée */
}

/* Effet active (au clic) */
button:active {
  transform: translateY(2px); /* Effet de clic */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Ombre réduite */
}

/* Bouton pour les likes */
.like-button {
  background-color: transparent; /* Fond transparent */
  color: #ff5722; /* Couleur principale */
  font-size: 1.5rem; /* Icône ou texte plus grand */
  border: 2px solid #ff5722; /* Bordure colorée */
  border-radius: 50%; /* Bouton circulaire */
  padding: 10px;
  width: 50px; /* Largeur fixe */
  height: 50px; /* Hauteur fixe */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Hover pour le bouton de like */
.like-button:hover {
  background-color: #ff5722; /* Fond coloré au survol */
  color: white; /* Icône ou texte blanc */
}

/* Bouton pour fermer la modale */
.close-modal {
  background-color: #ff5252; /* Rouge clair */
  color: white;
  font-size: 1rem;
  padding: 10px 15px;
  border-radius: 5px;
  margin-top: 20px;
}

/* Hover pour le bouton de fermeture */
.close-modal:hover {
  background-color: #d32f2f; /* Rouge plus sombre */
}

/* Bouton pour ajouter un commentaire */
.add-comment-button {
    background-color: #4caf50;
    /* gap: 20px; */
    color: white;
    font-size: 1rem;
    padding: 10px 15px;
    border-radius: 5px;
    margin-top: 10px;
    margin-left: 30px;
}

/* Hover pour le bouton de commentaire */
.add-comment-button:hover {
  background-color: #388e3c; /* Vert plus sombre */
}

/* Bouton pour supprimer un commentaire */
.delete-comment-button {
  background-color: #f44336; /* Rouge */
  color: white;
  font-size: 0.9rem;
  border-radius: 5px;
  cursor: pointer;
}

/* Hover pour le bouton de suppression */
.delete-comment-button:hover {
  background-color: #c62828; /* Rouge plus sombre */
}

/* Bouton de création d'article */
.create-button {
  background-color: #ff9800; /* Orange */
  color: white;
  font-size: 1rem;
  padding: 10px 20px;
  border-radius: 25px;
  margin-top: 20px;
}

/* Hover pour le bouton de création */
.create-button:hover {
  background-color: #f57c00; /* Orange plus sombre */
}

/* Bouton pour supprimer une recette */
.delete-recipe-button {
  background-color: #e53935; /* Rouge clair */
  color: white;
  font-size: 1rem;
  padding: 10px 15px;
  border-radius: 25px;
}

/* Hover pour supprimer une recette */
.delete-recipe-button:hover {
  background-color: #b71c1c; /* Rouge plus sombre */
}

/* Style désactivé */
button:disabled {
  background-color: #ddd; /* Gris clair */
  color: #aaa; /* Texte gris */
  cursor: not-allowed; /* Curseur désactivé */
  box-shadow: none; /* Pas d'ombre */
}

.create-recipe-form .form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

.create-recipe-form .form-group input,
.create-recipe-form .form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.create-recipe-form .create-button {
  background: #ff5722;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
}

.create-recipe-form .create-button:hover {
  background: #e64a19;
}

</style>
