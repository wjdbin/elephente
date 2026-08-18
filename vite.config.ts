import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,
      includeAssets: ['favicon.ico', 'favicon-32x32.png', 'apple-touch-icon.png', 'logo.png'],
      manifest: {
        name: '엘펜그라운드',
        short_name: '엘펜그라운드',
        description: '엘펜 부원을 위한 정모·WUFL·SUFA 일정',
        lang: 'ko',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#fffbf7',
        theme_color: '#fffbf7',
        icons: [
          { src: '/pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/pwa-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: '/pwa-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,webmanifest}'],
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-data',
              expiration: { maxEntries: 40, maxAgeSeconds: 10 * 60 },
            },
          },
        ],
      },
    }),
  ],
  server: {
    watch: {
      ignored: ['**/public/favicon.ico'],
    },
  },
})
