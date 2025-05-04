import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@base': path.resolve(__dirname, 'src/'),
      '@popup': path.resolve(__dirname, 'src/popup/'),
      '@pages': path.resolve(__dirname, 'src/popup/pages/'),
      '@components': path.resolve(__dirname, 'src/popup/components/'),
      '@api': path.resolve(__dirname, 'src/popup/api/'),
      '@assets': path.resolve(__dirname, 'src/assets/'),
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
  plugins: [react()],
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    rollupOptions: {
      input: {
        popup: path.resolve(__dirname, 'src/popup/main.tsx'),
        popupIndex: path.resolve(__dirname, 'index.html'),
        snipping: path.resolve(__dirname, 'src/snipping/content.tsx'),
        snippingBackground: path.resolve(
          __dirname,
          'src/snipping/background.tsx'
        ),
        // snippingCanvas: path.resolve(__dirname, 'src/snipping/offscreen.tsx'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          switch (chunkInfo.name) {
            case 'snipping':
              return '[name].js'
            case 'snippingBackground':
              return '[name].js'
            // case 'snippingCanvas':
            //   return '[name].js'
            default:
              return 'assets/[name]-[hash].js'
          }
        },
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
