import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "",  // 👈 Fix asset loading issue
  build: {
    outDir: "dist",
  },
})