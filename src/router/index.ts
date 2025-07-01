import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CardsView from '../views/CardsView.vue'
import CompareView from '../views/CompareView.vue'
import ChatbotView from '../views/ChatbotView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/cards',
      name: 'cards',
      component: CardsView
    },
    {
      path: '/compare',
      name: 'compare',
      component: CompareView
    },
    {
      path: '/chatbot',
      name: 'chatbot',
      component: ChatbotView
    }
  ]
})

export default router 