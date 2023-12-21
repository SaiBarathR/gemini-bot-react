import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
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
  build: {
    outDir: "build"
  },
  base: '/gemini-bot-react/'
})
