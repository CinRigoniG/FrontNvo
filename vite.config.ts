import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Define tus reglas de proxy aquí
      '/api': {
        target: 'https://depositoback-production.up.railway.app', // Cambia por el dominio de tu API
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Ajusta si es necesario
      },
    },
  },
})
