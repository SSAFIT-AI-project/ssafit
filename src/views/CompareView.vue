<template>
  <div class="compare">
    <div class="container">
      <!-- 헤더 -->
      <div class="page-header">
        <h1 class="page-title">카드 비교</h1>
        <p class="page-description">
          선택한 카드들을 한눈에 비교하여 최적의 카드를 찾아보세요
        </p>
      </div>

      <!-- 카드 선택 섹션 -->
      <div class="card-selection card p-4 mb-4">
        <h3 class="section-title">비교할 카드 선택</h3>
        <div class="selection-grid">
          <div 
            v-for="(slot, index) in comparisonSlots" 
            :key="index"
            class="selection-slot"
            :class="{ 'has-card': slot.card }"
          >
            <div v-if="slot.card" class="selected-card">
              <div class="card-preview">
                <div class="card-logo">{{ slot.card.image }}</div>
                <div class="card-info">
                  <h4 class="card-name">{{ slot.card.name }}</h4>
                  <div class="card-category">{{ slot.card.category }}</div>
                </div>
                <button class="remove-btn" @click="removeCard(index)">×</button>
              </div>
            </div>
            <div v-else class="empty-slot" @click="openCardSelector(index)">
              <div class="add-icon">+</div>
              <span>카드 추가</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 비교 테이블 -->
      <div v-if="hasCardsToCompare" class="comparison-table card p-4">
        <h3 class="section-title">카드 비교</h3>
        
        <!-- 기본 정보 비교 -->
        <div class="comparison-section">
          <h4 class="comparison-subtitle">기본 정보</h4>
          <div class="table-container">
            <table class="comparison-table">
              <thead>
                <tr>
                  <th>구분</th>
                  <th v-for="slot in comparisonSlots" :key="slot.id" v-if="slot.card">
                    {{ slot.card.name }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="feature-name">카테고리</td>
                  <td v-for="slot in comparisonSlots" :key="slot.id" v-if="slot.card">
                    {{ slot.card.category }}
                  </td>
                </tr>
                <tr>
                  <td class="feature-name">연회비</td>
                  <td v-for="slot in comparisonSlots" :key="slot.id" v-if="slot.card">
                    <span :class="getFeeClass(slot.card.annualFee)">
                      {{ slot.card.annualFee === 0 ? '무료' : `${slot.card.annualFee.toLocaleString()}원` }}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td class="feature-name">적립률</td>
                  <td v-for="slot in comparisonSlots" :key="slot.id" v-if="slot.card">
                    <span class="highlight">{{ slot.card.cashbackRate }}%</span>
                  </td>
                </tr>
                <tr>
                  <td class="feature-name">발급조건</td>
                  <td v-for="slot in comparisonSlots" :key="slot.id" v-if="slot.card">
                    {{ slot.card.requirement }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 혜택 비교 -->
        <div class="comparison-section">
          <h4 class="comparison-subtitle">주요 혜택</h4>
          <div class="table-container">
            <table class="comparison-table">
              <thead>
                <tr>
                  <th>혜택</th>
                  <th v-for="slot in comparisonSlots" :key="slot.id" v-if="slot.card">
                    {{ slot.card.name }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="benefitIndex in maxBenefits" :key="benefitIndex">
                  <td class="feature-name">혜택 {{ benefitIndex }}</td>
                  <td v-for="slot in comparisonSlots" :key="slot.id" v-if="slot.card">
                    {{ slot.card.benefits[benefitIndex - 1] || '-' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 추천 결과 -->
        <div class="recommendation-section">
          <h4 class="comparison-subtitle">AI 추천 결과</h4>
          <div class="recommendation-card card p-4">
            <div class="recommendation-header">
              <div class="recommendation-icon">🏆</div>
              <div class="recommendation-info">
                <h5 class="recommendation-title">최고 추천 카드</h5>
                <p class="recommendation-description">
                  {{ bestCard?.name }}이 가장 적합합니다
                </p>
              </div>
            </div>
            <div class="recommendation-reasons">
              <h6>추천 이유:</h6>
              <ul>
                <li>연회비 대비 높은 적립률</li>
                <li>다양한 혜택 제공</li>
                <li>발급 조건이 적절함</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- 빈 상태 -->
      <div v-else class="empty-state card p-4 text-center">
        <div class="empty-icon">📊</div>
        <h3 class="empty-title">비교할 카드를 선택해주세요</h3>
        <p class="empty-description">
          최대 3개까지 카드를 선택하여 비교할 수 있습니다
        </p>
        <button class="btn btn-primary" @click="openCardSelector(0)">
          첫 번째 카드 선택하기
        </button>
      </div>
    </div>

    <!-- 카드 선택 모달 -->
    <div v-if="showCardSelector" class="modal-overlay" @click="closeCardSelector">
      <div class="modal card p-4" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">카드 선택</h3>
          <button class="modal-close" @click="closeCardSelector">×</button>
        </div>
        <div class="modal-content">
          <div v-if="loading" class="loading-container">
            <div class="loading-spinner"></div>
            <p>카드 정보를 불러오는 중...</p>
          </div>
          <div v-else-if="error" class="error-container">
            <p>{{ error }}</p>
            <button class="btn btn-primary" @click="loadCards">다시 시도</button>
          </div>
          <div v-else class="card-list">
            <div 
              v-for="card in availableCards" 
              :key="card.id"
              class="card-item p-3"
              @click="selectCardForComparison(card)"
            >
              <div class="card-header">
                <div class="card-logo">{{ card.image }}</div>
                <div class="card-info">
                  <h4 class="card-name">{{ card.name }}</h4>
                  <div class="card-category">{{ card.category }}</div>
                </div>
                <div class="card-badge" :class="getBadgeClass(card.annualFee)">
                  {{ card.annualFee === 0 ? '무료' : `${card.annualFee.toLocaleString()}원` }}
                </div>
              </div>
              <div class="card-benefits">
                <div class="benefit-tag" v-for="benefit in card.benefits.slice(0, 2)" :key="benefit">
                  {{ benefit }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { apiService, type Card } from '../services/api'

interface ComparisonSlot {
  id: number
  card: Card | null
}

const cards = ref<Card[]>([])
const comparisonSlots = ref<ComparisonSlot[]>([
  { id: 1, card: null },
  { id: 2, card: null },
  { id: 3, card: null }
])

const showCardSelector = ref(false)
const selectedSlotIndex = ref(-1)
const loading = ref(false)
const error = ref('')

const hasCardsToCompare = computed(() => {
  return comparisonSlots.value.some(slot => slot.card !== null)
})

const availableCards = computed(() => {
  const selectedCardIds = comparisonSlots.value
    .map(slot => slot.card?.id)
    .filter(id => id !== undefined)
  return cards.value.filter(card => !selectedCardIds.includes(card.id))
})

const maxBenefits = computed(() => {
  const max = Math.max(...comparisonSlots.value
    .filter(slot => slot.card)
    .map(slot => slot.card!.benefits.length))
  return max || 0
})

const bestCard = computed(() => {
  const selectedCards = comparisonSlots.value
    .filter(slot => slot.card)
    .map(slot => slot.card!)
  
  if (selectedCards.length === 0) return null
  
  // 간단한 추천 로직: 적립률이 높고 연회비가 낮은 카드
  return selectedCards.reduce((best, current) => {
    const bestScore = best.cashbackRate / (best.annualFee + 1)
    const currentScore = current.cashbackRate / (current.annualFee + 1)
    return currentScore > bestScore ? current : best
  })
})

const getFeeClass = (annualFee: number) => {
  if (annualFee === 0) return 'fee-free'
  if (annualFee <= 30000) return 'fee-low'
  return 'fee-high'
}

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
  } catch (err) {
    error.value = '카드 정보를 불러오는데 실패했습니다.'
    cards.value = []
    console.error('Failed to load cards:', err)
  } finally {
    loading.value = false
  }
}

const openCardSelector = (slotIndex: number) => {
  selectedSlotIndex.value = slotIndex
  showCardSelector.value = true
}

const closeCardSelector = () => {
  showCardSelector.value = false
  selectedSlotIndex.value = -1
}

const selectCardForComparison = (card: Card) => {
  if (selectedSlotIndex.value >= 0) {
    comparisonSlots.value[selectedSlotIndex.value].card = card
  }
  closeCardSelector()
}

const removeCard = (slotIndex: number) => {
  comparisonSlots.value[slotIndex].card = null
}

onMounted(() => {
  loadCards()
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

function handleKeydown(e: KeyboardEvent) {
  if (showCardSelector.value && (e.key === 'Escape' || e.key === 'Esc' || e.key === 'x' || e.key === 'X')) {
    closeCardSelector()
  }
}
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

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: var(--spacing-lg);
  color: var(--text-primary);
}

.card-selection {
  margin-bottom: var(--spacing-xl);
}

.selection-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
}

.selection-slot {
  min-height: 120px;
  border: 2px dashed var(--samsung-gray);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.selection-slot.has-card {
  border-style: solid;
  border-color: var(--primary);
}

.empty-slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--text-secondary);
  cursor: pointer;
  padding: var(--spacing-lg);
}

.empty-slot:hover {
  color: var(--primary);
  border-color: var(--primary);
}

.add-icon {
  font-size: 2rem;
  font-weight: 300;
}

.selected-card {
  width: 100%;
  padding: var(--spacing-md);
}

.card-preview {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  position: relative;
}

.card-logo {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.card-info {
  flex: 1;
}

.card-name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
}

.card-category {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.remove-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: var(--text-secondary);
  cursor: pointer;
  padding: var(--spacing-xs);
  border-radius: var(--radius-sm);
}

.remove-btn:hover {
  color: #ef4444;
  background: #fef2f2;
}

.comparison-section {
  margin-bottom: var(--spacing-2xl);
}

.comparison-subtitle {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: var(--spacing-lg);
  color: var(--text-primary);
}

.table-container {
  overflow-x: auto;
}

.comparison-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
}

.comparison-table th,
.comparison-table td {
  padding: var(--spacing-md);
  text-align: left;
  border-bottom: 1px solid var(--surface);
}

.comparison-table th {
  background: var(--surface);
  font-weight: 600;
  color: var(--text-primary);
}

.comparison-table th:first-child,
.comparison-table td:first-child {
  background: var(--surface);
  font-weight: 500;
  color: var(--text-primary);
}

.feature-name {
  font-weight: 500;
  color: var(--text-primary);
}

.highlight {
  color: var(--primary);
  font-weight: 600;
}

.fee-free {
  color: #10b981;
  font-weight: 600;
}

.fee-low {
  color: #f59e0b;
  font-weight: 600;
}

.fee-high {
  color: #ef4444;
  font-weight: 600;
}

.recommendation-section {
  margin-top: var(--spacing-2xl);
}

.recommendation-card {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
  color: var(--samsung-white);
}

.recommendation-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.recommendation-icon {
  font-size: 2rem;
}

.recommendation-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
}

.recommendation-description {
  opacity: 0.9;
}

.recommendation-reasons h6 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
}

.recommendation-reasons ul {
  list-style: none;
  padding: 0;
}

.recommendation-reasons li {
  padding: var(--spacing-xs) 0;
  opacity: 0.9;
}

.recommendation-reasons li::before {
  content: "✓ ";
  color: #10b981;
  font-weight: 600;
}

.empty-state {
  text-align: center;
  padding: var(--spacing-2xl);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: var(--spacing-lg);
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: var(--spacing-md);
  color: var(--text-primary);
}

.empty-description {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xl);
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
  max-width: 800px;
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

.card-list {
  display: grid;
  gap: var(--spacing-md);
}

.card-item {
  cursor: pointer;
  border: 1px solid var(--surface);
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
}

.card-item:hover {
  border-color: var(--primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
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
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  margin-top: var(--spacing-sm);
}

.benefit-tag {
  background: var(--surface);
  color: var(--text-primary);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 500;
}

@media (max-width: 768px) {
  .selection-grid {
    grid-template-columns: 1fr;
  }
  
  .comparison-table {
    min-width: 400px;
  }
  
  .recommendation-header {
    flex-direction: column;
    text-align: center;
  }
  
  .modal {
    width: 95%;
  }
}
</style> 