<template>
  <div class="chatbot">
    <div class="container">
      <!-- 헤더 -->
      <div class="page-header">
        <h1 class="page-title">AI 카드 추천</h1>
        <p class="page-description">
          AI 챗봇과 대화하며 나에게 맞는 최고의 카드를 찾아보세요
        </p>
      </div>

      <!-- 챗봇 인터페이스 -->
      <div class="chatbot-container">
        <div class="chatbot-header">
          <div class="chatbot-avatar">🤖</div>
          <div class="chatbot-info">
            <h3 class="chatbot-name">카드 추천 AI</h3>
            <div class="chatbot-status" :class="{ 'typing': isTyping }">
              {{ isTyping ? '입력 중...' : '온라인' }}
            </div>
          </div>
          <button 
            class="clear-conversation-btn"
            @click="clearConversationAndRestart"
            title="새로운 대화 시작"
          >
            🔄 새로고침
          </button>
        </div>

        <!-- 채팅 영역 -->
        <div class="chat-messages" ref="messagesContainer">
          <div 
            v-for="(message, index) in messages" 
            :key="index"
            class="message"
            :class="message.type"
          >
            <div class="message-content">
              <div v-if="message.type === 'bot'" class="message-avatar">🤖</div>
              <div class="message-bubble">
                <p class="message-text" v-html="formatMessage(message.text)"></p>
                
                <!-- 추천 카드 -->
                <div v-if="message.recommendations && message.recommendations.length > 0" class="recommendations">
                  <h4 class="recommendations-title">추천 카드</h4>
                  <div class="recommendation-cards">
                    <div 
                      v-for="rec in message.recommendations" 
                      :key="rec.id"
                      class="recommendation-card card p-3"
                      @click="selectRecommendation(rec)"
                    >
                      <h5 class="rec-card-name">{{ rec.name }}</h5>
                      <p class="rec-card-reason">{{ rec.reason }}</p>
                      <div class="rec-card-benefits">
                        <span 
                          v-for="benefit in rec.benefits.slice(0, 2)" 
                          :key="benefit"
                          class="rec-benefit-tag"
                        >
                          {{ benefit }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 제안 버튼들 -->
                <div v-if="message.suggestions && message.suggestions.length > 0" class="suggestions">
                  <button 
                    v-for="suggestion in message.suggestions" 
                    :key="suggestion"
                    class="suggestion-btn"
                    @click="sendMessage(suggestion)"
                  >
                    {{ suggestion }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 타이핑 인디케이터 -->
          <div v-if="isTyping" class="message bot">
            <div class="message-content">
              <div class="message-avatar">🤖</div>
              <div class="message-bubble">
                <div class="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 입력 영역 -->
        <div class="chat-input">
          <div class="input-container">
            <input 
              v-model="userInput"
              type="text"
              class="message-input"
              placeholder="메시지를 입력하세요..."
              @keyup.enter="sendUserMessage"
              :disabled="isTyping"
            />
            <button 
              class="send-btn"
              @click="sendUserMessage"
              :disabled="!userInput.trim() || isTyping"
            >
              전송
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { apiService, type ChatbotResponse } from '../services/api'
import { marked } from 'marked'

interface Message {
  type: 'user' | 'bot'
  text: string
  suggestions?: string[]
  recommendations?: Array<{
    id: number
    name: string
    reason: string
    benefits: string[]
  }>
}

interface ConversationMessage {
  role: 'user' | 'assistant'
  content: string
}

const messages = ref<Message[]>([])
const userInput = ref('')
const isTyping = ref(false)
const messagesContainer = ref<HTMLElement>()

// 세션스토리지 키
const CONVERSATION_STORAGE_KEY = 'chatbot-conversation'

// 대화 기록을 세션스토리지에서 로드
const loadConversation = (): ConversationMessage[] => {
  try {
    const stored = sessionStorage.getItem(CONVERSATION_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Failed to load conversation from sessionStorage:', error)
    return []
  }
}

// 대화 기록을 세션스토리지에 저장
const saveConversation = (conversation: ConversationMessage[]) => {
  try {
    sessionStorage.setItem(CONVERSATION_STORAGE_KEY, JSON.stringify(conversation))
  } catch (error) {
    console.error('Failed to save conversation to sessionStorage:', error)
  }
}

// 대화 기록에 메시지 추가
const addToConversation = (role: 'user' | 'assistant', content: string) => {
  const conversation = loadConversation()
  conversation.push({ role, content })
  saveConversation(conversation)
}

// 세션스토리지 초기화 (새로운 대화 시작)
const clearConversation = () => {
  sessionStorage.removeItem(CONVERSATION_STORAGE_KEY)
}

const quickMessages = [
  '일상생활 카드 추천해줘',
  '교통비 절약 카드 찾아줘',
  '쇼핑 카드 추천해줘',
  '여행 카드 찾아줘'
]

// 메시지 스크롤을 맨 아래로
const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// 메시지 전송
const sendMessage = async (text: string) => {
  if (!text.trim() || isTyping.value) return

  // 사용자 메시지 추가 (UI 표시용)
  messages.value.push({
    type: 'user',
    text: text.trim()
  })

  userInput.value = ''
  await scrollToBottom()

  // AI 응답 처리
  await processBotResponse(text.trim())
}

// 사용자 메시지 전송
const sendUserMessage = () => {
  sendMessage(userInput.value)
}

// AI 응답 처리
const processBotResponse = async (userMessage: string) => {
  isTyping.value = true
  await scrollToBottom()

  try {
    // 현재 질문을 제외한 이전 대화 기록을 가져와서 API 호출
    const conversation = loadConversation()
    const response: ChatbotResponse = await apiService.getChatbotResponse(userMessage, conversation)

    // 봇 메시지 추가
    messages.value.push({
      type: 'bot',
      text: response.message,
      suggestions: response.suggestions,
      recommendations: response.recommendations
    })

    // AI 응답 후에 사용자 메시지와 AI 응답을 모두 대화 기록에 추가
    addToConversation('user', userMessage)
    addToConversation('assistant', response.message)

  } catch (error) {
    console.error('Failed to get bot response:', error)
    const errorMessage = '죄송합니다. 일시적인 오류가 발생했습니다. 다시 시도해주세요.'
    
    messages.value.push({
      type: 'bot',
      text: errorMessage,
      suggestions: ['일상생활 카드 추천해줘', '교통비 절약 카드 찾아줘']
    })

    // 에러 발생 시에도 사용자 메시지와 에러 메시지를 대화 기록에 추가
    addToConversation('user', userMessage)
    addToConversation('assistant', errorMessage)
  } finally {
    isTyping.value = false
    await scrollToBottom()
  }
}

// 추천 카드 선택
const selectRecommendation = (recommendation: any) => {
  console.log('선택된 추천 카드:', recommendation)
  // 여기에 카드 상세 페이지로 이동하거나 비교에 추가하는 로직 구현
}

// 메시지 변경 감지하여 스크롤
watch(messages, () => {
  scrollToBottom()
}, { deep: true })

// 초기 메시지
onMounted(async () => {
  // 세션스토리지에 대화 기록이 없을 때만 초기 메시지 추가
  const existingConversation = loadConversation()
  if (existingConversation.length === 0) {
    const welcomeMessage = '안녕하세요! 카드 추천을 도와드릴게요. 어떤 카드를 찾고 계신가요?'
    
    messages.value.push({
      type: 'bot',
      text: welcomeMessage,
      suggestions: [
        '연회비가 낮은 카드 추천해줘',
        '주유 할인 카드 추천해줘',
        '대중교통 할인 카드 추천해줘',
        '온라인 쇼핑 할인 카드 추천해줘'
      ]
    })

    // 초기 환영 메시지를 대화 기록에 추가
    addToConversation('assistant', welcomeMessage)
  } else {
    // 기존 대화 기록이 있으면 UI에 표시
    existingConversation.forEach((msg, index) => {
      if (msg.role === 'assistant') {
        // 마지막 메시지에만 suggestions 추가
        const isLastMessage = index === existingConversation.length - 1
        messages.value.push({
          type: 'bot',
          text: msg.content,
          suggestions: isLastMessage ? [
            '연회비가 낮은 카드 추천해줘',
            '주유 할인 카드 추천해줘',
            '대중교통 할인 카드 추천해줘',
            '온라인 쇼핑 할인 카드 추천해줘'
          ] : undefined
        })
      } else if (msg.role === 'user') {
        messages.value.push({
          type: 'user',
          text: msg.content
        })
      }
    })
  }
})

function formatMessage(text: string) {
  return marked.parse(text)
}

// 대화 기록 초기화 및 페이지 새로고침
const clearConversationAndRestart = () => {
  clearConversation()
  window.location.reload()
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

.chatbot-container {
  max-width: 800px;
  margin: 0 auto;
  background: var(--samsung-white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  margin-bottom: var(--spacing-2xl);
}

.chatbot-header {
  background: var(--primary);
  color: var(--samsung-white);
  padding: var(--spacing-lg);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.chatbot-avatar {
  font-size: 2rem;
  flex-shrink: 0;
}

.chatbot-info {
  flex: 1;
}

.chatbot-name {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
}

.chatbot-status {
  font-size: 0.875rem;
  opacity: 0.8;
}

.chatbot-status.typing {
  color: #ffd700;
}

.clear-conversation-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--samsung-white);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.clear-conversation-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

.chat-messages {
  height: 500px;
  overflow-y: auto;
  padding: var(--spacing-lg);
  background: var(--surface);
}

.message {
  margin-bottom: var(--spacing-lg);
}

.message-content {
  display: flex;
  gap: var(--spacing-md);
  align-items: flex-start;
}

.message.user .message-content {
  flex-direction: row-reverse;
}

.message-avatar {
  font-size: 1.5rem;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--samsung-white);
  border-radius: 50%;
  box-shadow: var(--shadow-sm);
}

.message-bubble {
  flex: 1;
  max-width: 70%;
}

.message.user .message-bubble {
  background: var(--primary);
  color: var(--samsung-white);
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
  border-bottom-right-radius: var(--radius-sm);
}

.message.bot .message-bubble {
  background: var(--samsung-white);
  color: var(--text-primary);
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
  border-bottom-left-radius: var(--radius-sm);
  box-shadow: var(--shadow-sm);
}

.message-text {
  word-break: break-word;
  white-space: pre-line;
  overflow-x: auto;
  max-width: 100%;
  font-size: 1rem;
  line-height: 1.7;
}

.message-text ul,
.message-text ol {
  margin: 0.5em 0 0.5em 1.5em;
  padding-left: 1.2em;
}

.message-text li {
  margin-bottom: 0.3em;
  word-break: break-word;
}

.message-text strong {
  font-weight: bold;
}
.message-text em {
  font-style: italic;
}

.message-text pre,
.message-text code {
  background: #f1f5f9;
  border-radius: 4px;
  padding: 2px 6px;
  font-family: 'Fira Mono', 'Consolas', monospace;
  font-size: 0.95em;
  color: #1e293b;
  overflow-x: auto;
}

.message-text table {
  border-collapse: collapse;
  width: 100%;
  margin: 1em 0;
}
.message-text th,
.message-text td {
  border: 1px solid #e5e7eb;
  padding: 0.5em 1em;
  text-align: left;
}

.recommendations {
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--surface);
}

.recommendations-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: var(--spacing-md);
  color: var(--text-primary);
}

.recommendation-cards {
  display: grid;
  gap: var(--spacing-md);
}

.recommendation-card {
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.recommendation-card:hover {
  border-color: var(--primary);
  transform: translateY(-2px);
}

.rec-card-name {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
  color: var(--text-primary);
}

.rec-card-reason {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-sm);
  line-height: 1.5;
}

.rec-card-benefits {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.rec-benefit-tag {
  background: var(--surface);
  color: var(--text-primary);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 500;
}

.suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
}

.suggestion-btn {
  background: var(--surface);
  color: var(--text-primary);
  border: 1px solid var(--samsung-gray);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.suggestion-btn:hover {
  background: var(--primary);
  color: var(--samsung-white);
  border-color: var(--primary);
}

.typing-indicator {
  display: flex;
  gap: var(--spacing-xs);
  align-items: center;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: var(--samsung-gray);
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
.typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

@keyframes typing {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.chat-input {
  padding: var(--spacing-lg);
  background: var(--samsung-white);
  border-top: 1px solid var(--surface);
}

.input-container {
  display: flex;
  gap: var(--spacing-md);
}

.message-input {
  flex: 1;
  padding: var(--spacing-md);
  border: 1px solid var(--samsung-gray);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  transition: border-color 0.2s ease;
}

.message-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgb(20 40 160 / 0.1);
}

.message-input:disabled {
  background: var(--surface);
  cursor: not-allowed;
}

.send-btn {
  background: var(--primary);
  color: var(--samsung-white);
  border: none;
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.send-btn:hover:not(:disabled) {
  background: var(--primary-light);
  transform: translateY(-1px);
}

.send-btn:disabled {
  background: var(--samsung-gray);
  cursor: not-allowed;
  transform: none;
}

.quick-start {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.quick-start-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: var(--spacing-lg);
  color: var(--text-primary);
}

.quick-start-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  justify-content: center;
}

.quick-btn {
  background: var(--surface);
  color: var(--text-primary);
  border: 1px solid var(--samsung-gray);
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.quick-btn:hover:not(:disabled) {
  background: var(--primary);
  color: var(--samsung-white);
  border-color: var(--primary);
  transform: translateY(-2px);
}

.quick-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

@media (max-width: 768px) {
  .chat-messages {
    height: 400px;
  }
  
  .message-bubble {
    max-width: 85%;
  }
  
  .input-container {
    flex-direction: column;
  }
  
  .quick-start-buttons {
    flex-direction: column;
  }
  
  .suggestions {
    flex-direction: column;
  }
  
  .suggestion-btn {
    text-align: center;
  }
}
</style> 