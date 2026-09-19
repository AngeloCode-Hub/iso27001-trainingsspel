import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Forwards /api/* calls to the ASP.NET Core backend during development,
    // so the frontend can just call fetch('/api/quiz') without hardcoding a host.
    proxy: {
      '/api': 'http://localhost:5199'
    }
  }
})
