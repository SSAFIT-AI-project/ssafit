<template>
  <div id="app">
    <nav class="navbar">
      <div class="container">
        <div class="nav-content">
          <router-link to="/" class="nav-logo">
            <div class="logo-icon">💳</div>
            <span class="logo-text">카드비교</span>
          </router-link>
          <div class="nav-links">
            <router-link to="/" class="nav-link">홈</router-link>
            <router-link to="/cards" class="nav-link">카드목록</router-link>
            <router-link to="/compare" class="nav-link">카드비교</router-link>
            <router-link to="/chatbot" class="nav-link">AI추천</router-link>
          </div>
        </div>
      </div>
    </nav>

    <main class="main-content">
      <router-view />
    </main>

    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h3 class="footer-title">카드비교 서비스</h3>
            <p class="footer-description">
              최적의 카드를 찾아드리는 스마트한 비교 서비스
            </p>
          </div>
          <div class="footer-section">
            <h4 class="footer-subtitle">서비스</h4>
            <ul class="footer-links">
              <li><router-link to="/cards">카드목록</router-link></li>
              <li><router-link to="/compare">카드비교</router-link></li>
              <li><router-link to="/chatbot">AI추천</router-link></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4 class="footer-subtitle">고객지원</h4>
            <ul class="footer-links">
              <li><a href="#">고객센터</a></li>
              <li><a href="#">자주묻는질문</a></li>
              <li><a href="#">문의하기</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2024 카드비교 서비스. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// 컴포넌트 로직
</script>

<style scoped>
.navbar {
  background: var(--samsung-white);
  border-bottom: 1px solid var(--surface);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: var(--shadow-sm);
}

.nav-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md) 0;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  text-decoration: none;
  color: var(--text-primary);
  font-weight: 700;
  font-size: 1.25rem;
}

.logo-icon {
  font-size: 1.5rem;
}

.logo-text {
  color: var(--primary);
}

.nav-links {
  display: flex;
  gap: var(--spacing-xl);
}

.nav-link {
  text-decoration: none;
  color: var(--text-secondary);
  font-weight: 500;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--primary);
  background-color: var(--surface);
}

.main-content {
  min-height: calc(100vh - 200px);
  padding: var(--spacing-xl) 0;
}

.footer {
  background: var(--samsung-dark-blue);
  color: var(--samsung-white);
  padding: var(--spacing-2xl) 0 var(--spacing-lg);
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
}

.footer-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: var(--spacing-md);
  color: var(--samsung-white);
}

.footer-description {
  color: var(--samsung-gray);
  line-height: 1.6;
}

.footer-subtitle {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: var(--spacing-md);
  color: var(--samsung-white);
}

.footer-links {
  list-style: none;
}

.footer-links li {
  margin-bottom: var(--spacing-sm);
}

.footer-links a {
  color: var(--samsung-gray);
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-links a:hover {
  color: var(--samsung-white);
}

.footer-bottom {
  border-top: 1px solid var(--samsung-gray);
  padding-top: var(--spacing-lg);
  text-align: center;
  color: var(--samsung-gray);
}

@media (max-width: 768px) {
  .nav-content {
    flex-direction: column;
    gap: var(--spacing-md);
  }
  
  .nav-links {
    gap: var(--spacing-md);
  }
  
  .footer-content {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }
}
</style> 