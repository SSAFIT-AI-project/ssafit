import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  // Vercel 배포를 위한 base 경로 (루트 경로 사용)
  base: '/',
  server: {
    port: 3000
  }
}) 