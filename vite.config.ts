import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  // GitHub Pages 배포를 위한 base 경로 (새로운 저장소 이름에 맞게 수정)
  base: '/ssafit/',
  server: {
    port: 3000
  }
}) 