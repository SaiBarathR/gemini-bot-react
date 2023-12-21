import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    strictPort: true,
    port: 3000
  },
  define: {
    global: 'window',
  },
  base: '/gemini-bot-react/'
})
