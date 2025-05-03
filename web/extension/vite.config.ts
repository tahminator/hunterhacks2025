import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@base': path.resolve(__dirname, 'src/'),
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
  plugins: [react()],
})
