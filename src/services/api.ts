// API 응답 타입 정의
export interface ApiResponse<T> {
  success: boolean
  data: T
}

export interface Card {
  id: number
  name: string
  category: string
  annualFee: number
  cashbackRate: number
  requirement: string
  benefits: string[]
  popularity: number
  image: string
  description: string
  features: string[]
}

export interface PopularCard {
  id: number
  name: string
  category: string
  annualFee: number
  mainBenefit: string
  popularity: number
  image: string
}

export interface CardsResponse {
  cards: Card[]
  categories: string[]
  total: number
}

export interface PopularCardsResponse {
  popularCards: PopularCard[]
}

export interface ChatbotResponse {
  message: string
  suggestions?: string[]
  recommendations?: Array<{
    id: number
    name: string
    reason: string
    benefits: string[]
  }>
}

export interface ChatbotResponsesResponse {
  responses: {
    [key: string]: ChatbotResponse
  }
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
const ASK_API_URL = 'https://13.209.64.155/ask'

// 환경 변수 로깅 (개발 환경에서만)
if (import.meta.env.DEV) {
  console.log('API Base URL:', API_BASE_URL)
  console.log('Environment:', import.meta.env.MODE)
}

// 에러 처리 함수
const handleApiError = (error: any): never => {
  console.error('API Error:', error)
  throw new Error('API 호출 중 오류가 발생했습니다.')
}

// API 호출 함수들
export const apiService = {
  // 카드 목록 조회 (더미)
  async getCards(): Promise<CardsResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/cards.json`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data: ApiResponse<CardsResponse> = await response.json()
      await new Promise(resolve => setTimeout(resolve, 300))
      return data.data
    } catch (error) {
      handleApiError(error)
    }
  },

  // 인기 카드 조회 (더미)
  async getPopularCards(): Promise<PopularCard[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/popular-cards.json`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data: ApiResponse<PopularCardsResponse> = await response.json()
      await new Promise(resolve => setTimeout(resolve, 200))
      return data.data.popularCards
    } catch (error) {
      handleApiError(error)
    }
  },

  // 카드 상세 정보 조회 (더미)
  async getCardById(id: number): Promise<Card> {
    try {
      const response = await fetch(`${API_BASE_URL}/cards.json`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data: ApiResponse<CardsResponse> = await response.json()
      await new Promise(resolve => setTimeout(resolve, 150))
      const card = data.data.cards.find(card => card.id === id)
      if (!card) {
        throw new Error('카드를 찾을 수 없습니다.')
      }
      return card
    } catch (error) {
      handleApiError(error)
    }
  },

  // 챗봇 응답 조회 (더미)
  async getChatbotResponseDummy(type: string): Promise<ChatbotResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/chatbot-responses.json`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data: ApiResponse<ChatbotResponsesResponse> = await response.json()
      await new Promise(resolve => setTimeout(resolve, 800))
      return data.data.responses[type] || data.data.responses.unknown
    } catch (error) {
      handleApiError(error)
    }
  },

  // 실제 AI 챗봇 질문 (서버)
  async getChatbotResponse(question: string): Promise<ChatbotResponse> {
    try {
      const response = await fetch(ASK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify({ question })
      })
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const data = await response.json()
      return {
        message: data.answer,
        suggestions: [
          "연회비가 낮은 카드 추천해줘",
          "주유 할인 카드 추천해줘",
          "대중교통 할인 카드 추천해줘",
          "온라인 쇼핑 할인 카드 추천해줘"
        ]
      }
    } catch (error) {
      handleApiError(error)
    }
  },

  // 카드 검색 (더미)
  async searchCards(params: {
    category?: string
    annualFee?: string
    sortBy?: string
  }): Promise<Card[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/cards.json`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data: ApiResponse<CardsResponse> = await response.json()
      await new Promise(resolve => setTimeout(resolve, 400))
      let filteredCards = [...data.data.cards]
      if (params.category) {
        filteredCards = filteredCards.filter(card => card.category === params.category)
      }
      if (params.annualFee) {
        switch (params.annualFee) {
          case '0':
            filteredCards = filteredCards.filter(card => card.annualFee === 0)
            break
          case '1-50000':
            filteredCards = filteredCards.filter(card => card.annualFee > 0 && card.annualFee <= 50000)
            break
          case '50000+':
            filteredCards = filteredCards.filter(card => card.annualFee > 50000)
            break
        }
      }
      if (params.sortBy) {
        switch (params.sortBy) {
          case 'name':
            filteredCards.sort((a, b) => a.name.localeCompare(b.name))
            break
          case 'annualFee':
            filteredCards.sort((a, b) => a.annualFee - b.annualFee)
            break
          case 'popularity':
            filteredCards.sort((a, b) => b.popularity - a.popularity)
            break
        }
      }
      return filteredCards
    } catch (error) {
      handleApiError(error)
    }
  }
} 