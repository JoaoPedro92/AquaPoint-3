import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  // Em `npm run dev` não há Nginx: o próprio Vite reencaminha a API e o
  // WebSocket para o backend local (porta 3000). Em Docker isto não é usado.
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
      '/socket.io': { target: 'http://localhost:3000', ws: true },
    },
  },
})
