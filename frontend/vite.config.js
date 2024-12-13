import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
yport: 3000, // Change default port from 5173 to 3000
    host: '0.0.0.0', // Allow external access
    open: true, // Auto-open browser
    proxy: {
      '/api': {
        target: 'http://35.200.148.90:8000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})

