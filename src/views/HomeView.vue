<template>
  <div class="home">
    <!-- 히어로 섹션 -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">
            싸피생에게 <span class="highlight">FIT</span>한 카드<br>
            <span class="highlight">당신만을 위한 선택</span>
          </h1>
          <p class="hero-description">
            AI 챗봇이 당신의 소비 패턴을 분석하여 가장 적합한 카드를 추천해드립니다.
            다양한 카드를 비교하고 최고의 혜택을 누려보세요.
          </p>
          <div class="hero-actions">
            <router-link to="/chatbot" class="btn btn-primary">
              AI 추천받기
            </router-link>
            <router-link to="/cards" class="btn btn-secondary">
              카드 둘러보기
            </router-link>
          </div>
        </div>
        <div class="hero-image">
          <div class="card-mockup">
            <div class="card-visual">
              <div class="card-chip">💳</div>
              <div class="card-number">**** **** **** 1234</div>
              <div class="card-info">
                <div class="card-holder">CARD HOLDER</div>
                <div class="card-expiry">12/25</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 특징 섹션 -->
    <section class="features">
      <div class="container">
        <h2 class="section-title text-center">왜 SSAFIT을 선택해야 할까요?</h2>
        <div class="grid grid-cols-3">
          <div class="feature-card card p-4">
            <div class="feature-icon">🤖</div>
            <h3 class="feature-title">AI 추천</h3>
            <p class="feature-description">
              개인 소비 패턴을 분석하여 최적의 카드를 추천해드립니다.
            </p>
          </div>
          <div class="feature-card card p-4">
            <div class="feature-icon">⚖️</div>
            <h3 class="feature-title">정확한 비교</h3>
            <p class="feature-description">
              혜택, 연회비, 한도 등 모든 조건을 한눈에 비교할 수 있습니다.
            </p>
          </div>
          <div class="feature-card card p-4">
            <div class="feature-icon">📊</div>
            <h3 class="feature-title">실시간 정보</h3>
            <p class="feature-description">
              최신 카드 정보와 혜택을 실시간으로 업데이트합니다.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 인기 카드 섹션 -->
    <section class="popular-cards">
      <div class="container">
        <h2 class="section-title text-center">인기 카드 TOP 3</h2>
        <div v-if="loading" class="loading-container">
          <div class="loading-spinner"></div>
          <p>카드 정보를 불러오는 중...</p>
        </div>
        <div v-else-if="error" class="error-container">
          <p>{{ error }}</p>
          <button class="btn btn-primary" @click="loadPopularCards">다시 시도</button>
        </div>
        <div v-else class="grid grid-cols-3">
          <div 
            v-for="card in popularCards" 
            :key="card.id" 
            class="card card-item p-4"
            @click="selectCard(card)"
          >
            <div class="card-header">
              <h3 class="card-name">{{ card.name }}</h3>
              <div class="card-badge">{{ card.category }}</div>
            </div>
            <div class="card-benefits">
              <div class="benefit-item">
                <span class="benefit-label">연회비</span>
                <span class="benefit-value">{{ card.annualFee }}원</span>
              </div>
              <div class="benefit-item">
                <span class="benefit-label">주요혜택</span>
                <span class="benefit-value">{{ card.mainBenefit }}</span>
              </div>
            </div>
            <div class="card-actions">
              <button class="btn btn-primary" @click.stop="openDetailModal(card)">자세히보기</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA 섹션 -->
    <section class="cta">
      <div class="container">
        <div class="cta-content text-center">
          <h2 class="cta-title">지금 바로 시작해보세요</h2>
          <p class="cta-description">
            AI 챗봇과 대화하며 나에게 맞는 최고의 카드를 찾아보세요
          </p>
          <router-link to="/chatbot" class="btn btn-primary">
            무료로 추천받기
          </router-link>
        </div>
      </div>
    </section>

    <!-- 카드 상세 모달 -->
    <div v-if="showDetailModal" class="modal-overlay" @click="closeDetailModal">
      <div class="modal card p-4" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">{{ selectedCard?.name }}</h2>
          <button class="modal-close" @click="closeDetailModal">×</button>
        </div>
        <div class="modal-content">
          <div class="card-detail-section">
            <h3>카드 정보</h3>
            <div class="detail-grid">
              <div class="detail-item">
                <span class="detail-label">카테고리</span>
                <span class="detail-value">{{ selectedCard?.category }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">연회비</span>
                <span class="detail-value">{{ selectedCard?.annualFee === 0 ? '무료' : `${selectedCard?.annualFee.toLocaleString()}원` }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">적립률</span>
                <span class="detail-value">{{ selectedCard?.cashbackRate }}%</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">발급조건</span>
                <span class="detail-value">{{ selectedCard?.requirement }}</span>
              </div>
            </div>
          </div>
          
          <div class="card-detail-section">
            <h3>카드 설명</h3>
            <p class="card-description">{{ selectedCard?.description }}</p>
          </div>
          
          <div class="card-detail-section">
            <h3>주요 혜택</h3>
            <ul class="benefit-list">
              <li v-for="benefit in selectedCard?.benefits" :key="benefit">
                {{ benefit }}
              </li>
            </ul>
          </div>
          
          <div class="card-detail-section">
            <h3>주요 특징</h3>
            <div class="features-grid">
              <div v-for="feature in selectedCard?.features" :key="feature" class="feature-tag">
                {{ feature }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { apiService, type Card } from '../services/api'

const popularCards = ref<Card[]>([])
const loading = ref(false)
const error = ref('')

const showDetailModal = ref(false)
const selectedCard = ref<Card | null>(null)

const openDetailModal = async (card: Card) => {
  // 카드 상세 정보를 가져옴
  try {
    const detailedCard = await apiService.getCardById(card.id)
    selectedCard.value = detailedCard
    showDetailModal.value = true
  } catch (err) {
    console.error('Failed to load card details:', err)
    // 상세 정보 로드 실패 시 기본 정보 사용
    selectedCard.value = card
    showDetailModal.value = true
  }
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedCard.value = null
}

const loadPopularCards = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await apiService.getPopularCards()
    popularCards.value = (response && response.data && response.data.popularCards) ? response.data.popularCards : []
    console.log('popularCards:', popularCards.value)
  } catch (err) {
    error.value = '카드 정보를 불러오는데 실패했습니다.'
    popularCards.value = []
    console.error('Failed to load popular cards:', err)
  } finally {
    loading.value = false
  }
}

const selectCard = (card: Card) => {
  openDetailModal(card)
}

onMounted(() => {
  loadPopularCards()
})
</script>

<style scoped>
.hero {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
  color: var(--samsung-white);
  padding: var(--spacing-2xl) 0;
  margin-bottom: var(--spacing-2xl);
}

.hero .container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-2xl);
  align-items: center;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: var(--spacing-lg);
}

.highlight {
  color: #ffd700;
}

.hero-description {
  font-size: 1.125rem;
  line-height: 1.6;
  margin-bottom: var(--spacing-xl);
  opacity: 0.9;
}

.hero-actions {
  display: flex;
  gap: var(--spacing-md);
}

.hero-image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-mockup {
  background: var(--samsung-white);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-lg);
  transform: rotate(-5deg);
}

.card-visual {
  width: 300px;
  height: 180px;
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  color: var(--samsung-white);
  position: relative;
}

.card-chip {
  font-size: 2rem;
  margin-bottom: var(--spacing-lg);
}

.card-number {
  font-size: 1.25rem;
  font-weight: 500;
  margin-bottom: var(--spacing-lg);
  letter-spacing: 2px;
}

.card-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  opacity: 0.8;
}

.features {
  padding: var(--spacing-2xl) 0;
  background: var(--surface);
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: var(--spacing-2xl);
  color: var(--text-primary);
}

.feature-card {
  text-align: center;
  border: none;
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: var(--spacing-md);
}

.feature-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: var(--spacing-md);
  color: var(--text-primary);
}

.feature-description {
  color: var(--text-secondary);
  line-height: 1.6;
}

.popular-cards {
  padding: var(--spacing-2xl) 0;
}

.loading-container,
.error-container {
  text-align: center;
  padding: var(--spacing-2xl);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--surface);
  border-top: 4px solid var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto var(--spacing-md);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.card-item {
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s ease;
}

.card-item:hover {
  border-color: var(--primary);
  transform: translateY(-4px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-md);
}

.card-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
}

.card-badge {
  background: var(--primary);
  color: var(--samsung-white);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 500;
}

.card-benefits {
  margin-bottom: var(--spacing-lg);
}

.benefit-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-sm);
}

.benefit-label {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.benefit-value {
  font-weight: 500;
  color: var(--text-primary);
}

.card-actions {
  text-align: center;
}

.cta {
  background: var(--samsung-dark-blue);
  color: var(--samsung-white);
  padding: var(--spacing-2xl) 0;
  margin-top: var(--spacing-2xl);
}

.cta-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: var(--spacing-md);
}

.cta-description {
  font-size: 1.125rem;
  margin-bottom: var(--spacing-xl);
  opacity: 0.9;
}

@media (max-width: 768px) {
  .hero .container {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-actions {
    justify-content: center;
  }
  
  .card-mockup {
    transform: none;
  }
  
  .card-visual {
    width: 250px;
    height: 150px;
  }
}

/* 모달 오버레이 */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.4);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 모달 본체 */
.modal {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  max-width: 600px;
  width: 100%;
  padding: 0;
  position: relative;
  animation: modal-fade-in 0.2s;
}

@keyframes modal-fade-in {
  from { transform: translateY(40px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.2rem 1.5rem 1rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1428a0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #64748b;
  cursor: pointer;
  padding: 0 0.5rem;
  border-radius: 50%;
  transition: background 0.2s;
}
.modal-close:hover {
  background: #f1f5f9;
}

.modal-content {
  padding: 1.5rem;
}

.card-detail-section {
  margin-bottom: var(--spacing-xl);
}

.card-detail-section h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: var(--spacing-md);
  color: var(--text-primary);
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.detail-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.detail-value {
  font-weight: 500;
  color: var(--text-primary);
}

.card-description {
  color: var(--text-secondary);
  line-height: 1.6;
}

.benefit-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.benefit-list li {
  padding: var(--spacing-sm) 0;
  border-bottom: 1px solid var(--surface);
  color: var(--text-primary);
}

.benefit-list li:last-child {
  border-bottom: none;
}

.features-grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.feature-tag {
  background: var(--surface);
  color: var(--text-primary);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 500;
}
</style> 