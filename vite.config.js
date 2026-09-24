import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      // Optional dev proxy: same-origin /api calls forward to the Node backend.
      // The app uses VITE_API_URL by default; this proxy is a fallback that
      // avoids CORS issues if VITE_API_URL is left unset.
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 5173,
  },
})
