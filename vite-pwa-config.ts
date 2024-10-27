import { VitePWAOptions } from 'vite-plugin-pwa'

export const pwaConfiguration: Partial<VitePWAOptions> = {
  registerType: 'autoUpdate',
  manifest: {
    name: 'PyPouch',
    short_name: 'PyPouch',
    theme_color: '#00457C',
    icons: [
      {
        src: 'pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png'
      }
    ],
    background_color: '#00457C',
    display: 'standalone',
    scope: '/',
    start_url: '/',
    orientation: 'portrait'
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg,ttf}'],
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/api\.*/i,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'api-cache',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
          },
          cacheableResponse: {
            statuses: [0, 200]
          }
        }
      }
    ]
  }
}