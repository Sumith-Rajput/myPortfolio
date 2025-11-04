import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'build', // Changed from 'dist' to 'build' for Azure Static Web Apps compatibility
    sourcemap: false, // Disable source maps in production to prevent 404 errors for source files
  },
})

