<template>
  <div v-if="isAuthenticated" class="admin-page">
    <aside class="sidebar">
      <nav>
        <ul>
          <li @click="showSection('users')" :class="{ active: currentSection === 'users' }">Utilisateurs</li>
          <li @click="showSection('articles')" :class="{ active: currentSection === 'articles' }">Articles</li>
        </ul>
      </nav>
    </aside>

    <main class="content">
      <div v-if="currentSection === 'users'" class="section">
        <h2>Utilisateurs</h2>
        <ul class="data-list">
          <li v-for="user in users" :key="user.username" class="data-item">
            <div class="user-item">
              <span>{{ user.username }}</span>
              <button @click="deleteUser(user.username)">Supprimer</button>
            </div>
          </li>
        </ul>
        <form @submit.prevent="addUser" class="form">
          <h3>Ajouter un utilisateur</h3>
          <input v-model="newUser.username" type="text" placeholder="Nom d'utilisateur" required />
          <input v-model="newUser.email" type="email" placeholder="Email" required />
          <input v-model="newUser.password" type="password" placeholder="Mot de passe" required />
          <button type="submit">Ajouter</button>
        </form>
      </div>

      <div v-if="currentSection === 'articles'" class="section">
        <h2>Articles</h2>
        <ul class="data-list">
          <li v-for="article in articles" :key="article.slug" class="data-item">
            <div class="article-item">
              <span>{{ article.title }}</span>
              <button @click="deleteArticle(article.slug)">Supprimer</button>
            </div>
          </li>
        </ul>
        <form @submit.prevent="addArticle" class="form">
          <h3>Ajouter un article</h3>
          <input v-model="newArticle.title" type="text" placeholder="Titre" required />
          <textarea v-model="newArticle.description" placeholder="Description" required></textarea>
          <textarea v-model="newArticle.body" placeholder="Contenu" required></textarea>
          <input v-model="newArticle.tags" type="text" placeholder="Tags (séparés par des virgules)" />
          <button type="submit">Ajouter</button>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../api/axios";

const isAuthenticated = ref(false);
const currentSection = ref("users");
const users = ref([]);
const articles = ref([]);
const newUser = ref({ username: "", email: "", password: "" });
const newArticle = ref({ title: "", description: "", body: "", tags: "" });

const AUTH_PASSWORD = "admin123";

const checkAccess = () => {
  const enteredPassword = prompt("Entrez le mot de passe pour accéder à l'administration :");
  if (enteredPassword === AUTH_PASSWORD) {
    isAuthenticated.value = true;
  } else {
    alert("Mot de passe incorrect !");
    isAuthenticated.value = false;
    window.location.href = '/';

  }
};

const loadUsers = async () => {
  try {
    let allUsers = [];
    let page = 1;

    while (true) {
      const response = await api.get(`/api/users?page=${page}`);
      if (response.data.users.length === 0) break;
      allUsers = [...allUsers, ...response.data.users];
      page++;
    }

    users.value = allUsers;
  } catch (error) {
    console.error("Erreur lors du chargement des utilisateurs :", error);
  }
};

const addUser = async () => {
  try {
    const response = await api.post("/api/users", { user: newUser.value });
    users.value.push(response.data.user);
    newUser.value = { username: "", email: "", password: "" };
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'utilisateur :", error);
  }
};

const deleteUser = async (username) => {
  try {
    await api.delete(`/api/users/${username}`);
    users.value = users.value.filter((user) => user.username !== username);
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur :", error);
  }
};

const loadArticles = async () => {
  try {
    const response = await api.get("/api/articles");
    articles.value = response.data.articles;
  } catch (error) {
    console.error("Erreur lors du chargement des articles :", error);
  }
};

const addArticle = async () => {
  try {
    const payload = {
      article: {
        title: newArticle.value.title,
        description: newArticle.value.description,
        body: newArticle.value.body,
        tagList: newArticle.value.tags.split(",").map((tag) => tag.trim()),
      },
    };
    const response = await api.post("/api/articles", payload);
    articles.value.push(response.data.article);
    newArticle.value = { title: "", description: "", body: "", tags: "" };
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'article :", error);
  }
};

const deleteArticle = async (slug) => {
  try {
    await api.delete(`/api/articles/${slug}`);
    articles.value = articles.value.filter((article) => article.slug !== slug);
  } catch (error) {
    console.error("Erreur lors de la suppression de l'article :", error);
  }
};

const showSection = (section) => {
  currentSection.value = section;
};

onMounted(() => {
  checkAccess();
  if (isAuthenticated.value) {
    loadUsers();
    loadArticles();
  }
});
</script>

<style scoped>
.admin-page {
  display: flex;
  height: 100vh;
  background: linear-gradient(to bottom, #ff5722, #ff8a50);
  color: white;
  justify-content: center;
  align-items: center;
}

.sidebar {
  width: 200px;
  background: #ff5722;
  padding: 20px;
  border-radius: 10px;
}

.sidebar nav ul {
  list-style: none;
  padding: 0;
}

.sidebar nav ul li {
  padding: 10px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.sidebar nav ul li:hover,
.sidebar nav ul li.active {
  background: #e64a19;
  font-weight: bold;
}

.content {
  flex: 1;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 600px;
  max-height: 80%;
  overflow-y: auto;
}

.section h2 {
  color: #ff5722;
}

.data-list {
  list-style: none;
  padding: 0;
}

.data-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  align-items: center;
  color: black;
  margin-right: 50px;
}

button {
  background: #ff5722;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 5px;
  transition: background 0.3s ease;
}

button:hover {
  background: #e64a19;
}

.form {
  margin-top: 20px;
}

.form h3 {
  color: #ff5722;
}

input,
textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

button[type="submit"] {
  width: 100%;
}
</style>
