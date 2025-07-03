import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Card } from '../services/api'

export const useCompareStore = defineStore('compare', () => {
  // 비교할 카드 목록 (최대 3개)
  const comparisonCards = ref<Card[]>([])

  // 비교할 카드가 있는지 확인
  const hasCardsToCompare = computed(() => comparisonCards.value.length > 0)

  // 비교할 수 있는 최대 카드 수
  const maxCards = 3

  // 카드를 비교 목록에 추가
  const addToCompare = (card: Card) => {
    // 이미 추가된 카드인지 확인
    if (comparisonCards.value.some(c => c.id === card.id)) {
      return { success: false, message: '이미 추가된 카드입니다.' }
    }

    // 최대 개수 확인
    if (comparisonCards.value.length >= maxCards) {
      return { success: false, message: `최대 ${maxCards}개까지만 비교할 수 있습니다.` }
    }

    comparisonCards.value.push(card)
    return { success: true, message: '비교 목록에 추가되었습니다.' }
  }

  // 카드를 비교 목록에서 제거
  const removeFromCompare = (cardId: number) => {
    const index = comparisonCards.value.findIndex(card => card.id === cardId)
    if (index !== -1) {
      comparisonCards.value.splice(index, 1)
      return { success: true, message: '비교 목록에서 제거되었습니다.' }
    }
    return { success: false, message: '카드를 찾을 수 없습니다.' }
  }

  // 특정 인덱스의 카드 제거
  const removeCardAtIndex = (index: number) => {
    if (index >= 0 && index < comparisonCards.value.length) {
      comparisonCards.value.splice(index, 1)
      return { success: true, message: '카드가 제거되었습니다.' }
    }
    return { success: false, message: '유효하지 않은 인덱스입니다.' }
  }

  // 비교 목록 초기화
  const clearCompare = () => {
    comparisonCards.value = []
  }

  // 카드가 비교 목록에 있는지 확인
  const isInCompare = (cardId: number) => {
    return comparisonCards.value.some(card => card.id === cardId)
  }

  // 비교 목록의 카드 수
  const compareCount = computed(() => comparisonCards.value.length)

  // 최고 추천 카드 계산
  const bestCard = computed(() => {
    if (comparisonCards.value.length === 0) return null

    // 간단한 추천 로직: 적립률이 높고 연회비가 낮은 카드
    return comparisonCards.value.reduce((best, current) => {
      const bestScore = best.cashbackRate / (best.annualFee + 1)
      const currentScore = current.cashbackRate / (current.annualFee + 1)
      return currentScore > bestScore ? current : best
    })
  })

  // 최대 혜택 개수 계산
  const maxBenefits = computed(() => {
    if (comparisonCards.value.length === 0) return 0
    return Math.max(...comparisonCards.value.map(card => card.benefits.length))
  })

  return {
    comparisonCards,
    hasCardsToCompare,
    maxCards,
    addToCompare,
    removeFromCompare,
    removeCardAtIndex,
    clearCompare,
    isInCompare,
    compareCount,
    bestCard,
    maxBenefits
  }
}) 