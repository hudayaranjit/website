import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // This enables access from your mobile phone on the same Wi-Fi
  },
  build: {
    outDir: './backend/static',
    emptyOutDir: true,
  },
})

