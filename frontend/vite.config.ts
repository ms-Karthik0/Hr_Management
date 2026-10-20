import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173,
    proxy: {
      '/api/auth': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
      '/api/employees': {
        target: 'http://localhost:8082',
        changeOrigin: true,
      },
      '/api/departments': {
        target: 'http://localhost:8082',
        changeOrigin: true,
      },
      '/api/ai': {
        target: 'http://localhost:8082',
        changeOrigin: true,
      },
      '/api/payroll': {
        target: 'http://localhost:8084',
        changeOrigin: true,
      },
      '/api/attendance': {
        target: 'http://localhost:8083',
        changeOrigin: true,
      },
      '/api/leaves': {
        target: 'http://localhost:8083',
        changeOrigin: true,
      },
      '/api/performance': {
        target: 'http://localhost:8083',
        changeOrigin: true,
      },
      '/api/notifications': {
        target: 'http://localhost:8083',
        changeOrigin: true,
      },
      '/api/dashboard': {
        target: 'http://localhost:8083',
        changeOrigin: true,
      },
      '/api/ws': {
        target: 'http://localhost:8083',
        ws: true,
      }
    }
  }
})
