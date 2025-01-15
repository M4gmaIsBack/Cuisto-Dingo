import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/', component: () => import('./components/Home.vue') },
  { path: '/articles', component: () => import('./components/Articles.vue') },
  { path: '/articles/:slug', component: () => import('./components/ArticleDetail.vue') },
  { path: '/login', component: () => import('./components/Login.vue') }, // Route de connexion
  { path: '/register', component: () => import('./components/Register.vue') }, // Route d'inscription
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
