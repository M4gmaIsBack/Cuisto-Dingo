<template>
  <div>
    <!-- Hero Section -->
    <section class="hero">
      <div class="overlay"></div>
      <div class="hero-content">
        <img src="@/assets/logo.png" alt="Cuisto'Dingo Logo" class="hero-logo" />
        <h1 class="hero-title">Bienvenue chez Cuisto'Dingo 🍳</h1>
      </div>
    </section>

    <!-- Deuxième Section -->
    <section class="features">
      <h2 class="features-title">POURQUOI CHOISIR CUISTO'DINGO ?</h2>
      <div class="features-grid">
        <div class="feature-card">
          <img src="@/assets/community.png" alt="Communauté" class="feature-icon" />
          <h3>Une communauté passionnée</h3>
          <p>
            Rejoignez une communauté de passionnés qui partagent leurs meilleures recettes et astuces de cuisine.
          </p>
        </div>
        <div class="feature-card">
          <img src="@/assets/recettes.png" alt="Recettes" class="feature-icon" />
          <h3>Des recettes uniques</h3>
          <p>
            Découvrez des recettes exclusives et accessibles, adaptées à tous les niveaux de compétence.
          </p>
        </div>
      </div>
    </section>

    <!-- Troisième Section -->
    <section class="cta-section">
      <div class="cta-content">
        <h2>Venez rejoindre la bande du dingo ?</h2>
        <p>
          Rejoignez Cuisto'Dingo et partager vos recettes incroyable !
        </p>
        <router-link to="/register" class="cta-button">Inscription</router-link>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Section Hero */
.hero {
  position: relative;
  height: 100vh;
  background: url('@/assets/hero-background.jpg') no-repeat center center/cover;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  overflow: hidden;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4); /* Couche sombre */
  backdrop-filter: blur(2px); /* Effet de flou */
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  color: white;
}

.hero-title {
  font-family: 'Outfit', sans-serif;
  font-weight: 900; /* Style Black */
  font-size: 3rem;
  margin-bottom: 20px;
  color: white;
  text-transform: uppercase;
  line-height: 1.2;
}

.hero-logo {
  max-width: 400px;
  margin-top: 20px;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));
}

/* Section Features */
.features {
  background-color: #fdfdfd;
  text-align: center;
  padding: 60px 20px;
}

.features-title {
  font-family: 'Outfit', sans-serif;
  font-weight: 700;
  font-size: 2.5rem;
  color: #ff5722;
  margin-bottom: 40px;
}

.features-grid {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.feature-card {
  background: white;
  border-radius: 15px;
  padding: 20px;
  max-width: 300px;
  text-align: center;
  box-shadow: 0 5px 15px rgb(0 0 0 / 61%);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.feature-icon {
  max-width: 80px;
  margin-bottom: 15px;
}

.feature-card h3 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 10px;
}

.feature-card p {
  font-size: 1rem;
  color: #555;
}

/* Section CTA */
.cta-section {
  background: linear-gradient(90deg, #ff5722, #e64a19);
  text-align: center;
  padding: 80px 20px;
  color: white;
}

.cta-content h2 {
  font-family: 'Outfit', sans-serif;
  font-weight: 700;
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.cta-content p {
  font-size: 1.2rem;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto 30px;
}

.cta-button {
  background: white;
  color: #ff5722;
  padding: 15px 30px;
  font-size: 1.2rem;
  font-weight: bold;
  text-decoration: none;
  border-radius: 50px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.cta-button:hover {
  background-color: #ffe0b2;
  color: #e64a19;
}
</style>
