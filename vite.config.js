import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Task Nova',
        short_name: 'Task Nova',
        description: 'Plan. Focus. Get Things Done.',
        theme_color: '#0b1120',
        background_color: '#0b1120',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/nova.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/nova.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
})