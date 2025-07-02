<template>
  <div class="cards">
    <div class="container">
      <!-- 헤더 -->
      <div class="page-header">
        <h1 class="page-title">카드 목록</h1>
        <p class="page-description">
          다양한 카드를 비교하고 나에게 맞는 최적의 카드를 찾아보세요
        </p>
      </div>

      <!-- 필터 섹션 -->
      <div class="filters card p-4 mb-4">
        <div class="filter-row">
          <div class="filter-group">
            <label class="filter-label">카테고리</label>
            <select v-model="selectedCategory" class="input" @change="applyFilters">
              <option value="">전체</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
          <div class="filter-group">
            <label class="filter-label">연회비</label>
            <select v-model="selectedFee" class="input" @change="applyFilters">
              <option value="">전체</option>
              <option value="0">무료</option>
              <option value="1-50000">1만원 ~ 5만원</option>
              <option value="50000+">5만원 이상</option>
            </select>
          </div>
          <div class="filter-group">
            <label class="filter-label">정렬</label>
            <select v-model="sortBy" class="input" @change="applyFilters">
              <option value="name">이름순</option>
              <option value="annualFee">연회비순</option>
              <option value="popularity">인기순</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 카드 그리드 -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>카드 정보를 불러오는 중...</p>
      </div>
      <div v-else-if="error" class="error-container">
        <p>{{ error }}</p>
        <button class="btn btn-primary" @click="loadCards">다시 시도</button>
      </div>
      <div v-else class="cards-grid">
        <div 
          v-for="card in filteredCards" 
          :key="card.id" 
          class="card card-item p-4"
          @click="showCardDetail(card)"
        >
          <div class="card-header">
            <div class="card-logo">{{ card.image }}</div>
            <div class="card-info">
              <h3 class="card-name">{{ card.name }}</h3>
              <div class="card-category">{{ card.category }}</div>
            </div>
            <div class="card-badge" :class="getBadgeClass(card.annualFee)">
              {{ card.annualFee === 0 ? '무료' : `${card.annualFee.toLocaleString()}원` }}
            </div>
          </div>
          
          <div class="card-benefits">
            <div class="benefit-list">
              <div 
                v-for="benefit in card.benefits.slice(0, 3)" 
                :key="benefit"
                class="benefit-tag"
              >
                {{ benefit }}
              </div>
            </div>
          </div>
          
          <div class="card-stats">
            <div class="stat-item">
              <span class="stat-label">적립률</span>
              <span class="stat-value">{{ card.cashbackRate }}%</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">발급조건</span>
              <span class="stat-value">{{ card.requirement }}</span>
            </div>
          </div>
          
          <div class="card-actions">
            <button class="btn btn-primary" @click.stop="addToCompare(card)">
              비교하기
            </button>
            <button class="btn btn-secondary" @click.stop="showCardDetail(card)">
              자세히보기
            </button>
          </div>
        </div>
      </div>

      <!-- 빈 결과 -->
      <div v-if="!loading && !error && filteredCards.length === 0" class="empty-results">
        <div class="empty-icon">🔍</div>
        <h3>검색 결과가 없습니다</h3>
        <p>다른 조건으로 검색해보세요.</p>
        <button class="btn btn-primary" @click="resetFilters">필터 초기화</button>
      </div>

      <!-- 페이지네이션 -->
      <div v-if="filteredCards.length > 0" class="pagination">
        <button 
          class="btn btn-secondary"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          이전
        </button>
        <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
        <button 
          class="btn btn-secondary"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          다음
        </button>
      </div>
    </div>

    <!-- 카드 상세 모달 -->
    <div v-if="selectedCard" class="modal-overlay" @click="closeModal">
      <div class="modal card p-4" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">{{ selectedCard.name }}</h2>
          <button class="modal-close" @click="closeModal">×</button>
        </div>
        <div class="modal-content">
          <div class="card-detail-section">
            <h3>카드 정보</h3>
            <div class="detail-grid">
              <div class="detail-item">
                <span class="detail-label">카테고리</span>
                <span class="detail-value">{{ selectedCard.category }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">연회비</span>
                <span class="detail-value">{{ selectedCard.annualFee === 0 ? '무료' : `${selectedCard.annualFee.toLocaleString()}원` }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">적립률</span>
                <span class="detail-value">{{ selectedCard.cashbackRate }}%</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">발급조건</span>
                <span class="detail-value">{{ selectedCard.requirement }}</span>
              </div>
            </div>
          </div>
          
          <div class="card-detail-section">
            <h3>카드 설명</h3>
            <p class="card-description">{{ selectedCard.description }}</p>
          </div>
          
          <div class="card-detail-section">
            <h3>주요 혜택</h3>
            <ul class="benefit-list">
              <li v-for="benefit in selectedCard.benefits" :key="benefit">
                {{ benefit }}
              </li>
            </ul>
          </div>
          
          <div class="card-detail-section">
            <h3>주요 특징</h3>
            <div class="features-grid">
              <div v-for="feature in selectedCard.features" :key="feature" class="feature-tag">
                {{ feature }}
              </div>
            </div>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn btn-primary" @click="addToCompare(selectedCard)">
            비교하기에 추가
          </button>
          <button class="btn btn-secondary" @click="closeModal">
            닫기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { apiService, type Card } from '../services/api'

const cards = ref<Card[]>([])
const categories = ref<string[]>([])
const selectedCategory = ref('')
const selectedFee = ref('')
const sortBy = ref('name')
const currentPage = ref(1)
const selectedCard = ref<Card | null>(null)
const loading = ref(false)
const error = ref('')

const filteredCards = computed(() => {
  let filtered = [...cards.value]
  
  if (selectedCategory.value) {
    filtered = filtered.filter(card => card.category === selectedCategory.value)
  }
  
  if (selectedFee.value) {
    if (selectedFee.value === '0') {
      filtered = filtered.filter(card => card.annualFee === 0)
    } else if (selectedFee.value === '1-50000') {
      filtered = filtered.filter(card => card.annualFee > 0 && card.annualFee <= 50000)
    } else if (selectedFee.value === '50000+') {
      filtered = filtered.filter(card => card.annualFee > 50000)
    }
  }
  
  // 정렬
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'annualFee':
        return a.annualFee - b.annualFee
      case 'popularity':
        return b.popularity - a.popularity
      default:
        return 0
    }
  })
  
  return filtered
})

const totalPages = computed(() => Math.ceil(filteredCards.value.length / 6))

const getBadgeClass = (annualFee: number) => {
  if (annualFee === 0) return 'badge-free'
  if (annualFee <= 30000) return 'badge-low'
  return 'badge-high'
}

const loadCards = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await apiService.getCards()
    cards.value = (response && response.data && response.data.cards) ? response.data.cards : []
    categories.value = (response && response.data && response.data.categories) ? response.data.categories : []
  } catch (err) {
    error.value = '카드 정보를 불러오는데 실패했습니다.'
    cards.value = []
    categories.value = []
    console.error('Failed to load cards:', err)
  } finally {
    loading.value = false
  }
}

const applyFilters = () => {
  currentPage.value = 1
}

const resetFilters = () => {
  selectedCategory.value = ''
  selectedFee.value = ''
  sortBy.value = 'name'
  currentPage.value = 1
}

const showCardDetail = (card: Card) => {
  selectedCard.value = card
}

const closeModal = () => {
  selectedCard.value = null
}

const addToCompare = (card: Card) => {
  // 비교 기능 구현
  console.log('비교에 추가:', card.name)
}

onMounted(() => {
  loadCards()
})
</script>

<style scoped>
.page-header {
  text-align: center;
  margin-bottom: var(--spacing-2xl);
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
}

.page-description {
  font-size: 1.125rem;
  color: var(--text-secondary);
}

.filters {
  margin-bottom: var(--spacing-xl);
}

.filter-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-lg);
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.filter-label {
  font-weight: 500;
  color: var(--text-primary);
}

.loading-container,
.error-container,
.empty-results {
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

.empty-icon {
  font-size: 3rem;
  margin-bottom: var(--spacing-md);
}

.empty-results h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
  color: var(--text-primary);
}

.empty-results p {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-lg);
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.card-item {
  cursor: pointer;
  transition: all 0.2s ease;
}

.card-item:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.card-header {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.card-logo {
  font-size: 2rem;
  flex-shrink: 0;
}

.card-info {
  flex: 1;
}

.card-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
}

.card-category {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.card-badge {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--samsung-white);
}

.badge-free {
  background: #10b981;
}

.badge-low {
  background: #f59e0b;
}

.badge-high {
  background: #ef4444;
}

.card-benefits {
  margin-bottom: var(--spacing-lg);
}

.benefit-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.benefit-tag {
  background: var(--surface);
  color: var(--text-primary);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 500;
}

.card-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.stat-value {
  font-weight: 500;
  color: var(--text-primary);
}

.card-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.card-actions .btn {
  flex: 1;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--spacing-md);
}

.page-info {
  font-weight: 500;
  color: var(--text-primary);
}

/* 모달 스타일 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--surface);
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-secondary);
  padding: var(--spacing-xs);
}

.modal-close:hover {
  color: var(--text-primary);
}

.card-detail-section {
  margin-bottom: var(--spacing-lg);
}

.card-detail-section h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: var(--spacing-md);
  color: var(--text-primary);
}

.card-description {
  color: var(--text-secondary);
  line-height: 1.6;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: var(--spacing-sm) 0;
  border-bottom: 1px solid var(--surface);
}

.detail-label {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.detail-value {
  font-weight: 500;
  color: var(--text-primary);
}

.benefit-list {
  list-style: none;
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
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--spacing-sm);
}

.feature-tag {
  background: var(--surface);
  color: var(--text-primary);
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
  text-align: center;
  font-size: 0.875rem;
  font-weight: 500;
}

.modal-actions {
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--surface);
}

@media (max-width: 768px) {
  .cards-grid {
    grid-template-columns: 1fr;
  }
  
  .filter-row {
    grid-template-columns: 1fr;
  }
  
  .card-stats {
    grid-template-columns: 1fr;
  }
  
  .card-actions {
    flex-direction: column;
  }
  
  .detail-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style> 