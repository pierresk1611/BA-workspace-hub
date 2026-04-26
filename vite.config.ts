import { defineConfig, loadEnv } from 'vite';
import type { ViteDevServer } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  const mockAuthPlugin = () => ({
    name: 'mock-auth-plugin',
    configureServer(server: ViteDevServer) {
      server.middlewares.use('/api/login', (req: any, res: any, next: () => void) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: Buffer) => {
            body += chunk.toString();
          });
          req.on('end', () => {
            try {
              const { username, password } = JSON.parse(body);
              const validUser = env.LOGIN_USERNAME || 'peter';
              const validPass = env.LOGIN_PASSWORD || '2703_Viera';
              
              res.setHeader('Content-Type', 'application/json');
              
              if (username === validUser && password === validPass) {
                res.statusCode = 200;
                res.end(JSON.stringify({
                  ok: true,
                  token: env.AUTH_TOKEN_SECRET || 'prototype-session-token',
                  user: { username }
                }));
              } else {
                res.statusCode = 401;
                res.end(JSON.stringify({
                  ok: false,
                  message: "Nesprávne prihlasovacie údaje"
                }));
              }
            } catch (e) {
              res.statusCode = 400;
              res.end(JSON.stringify({ ok: false, message: "Invalid request" }));
            }
          });
        } else {
          next();
        }
      });
    }
  });

  return {
    plugins: [
      react(), 
      tailwindcss(), 
      mockAuthPlugin(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icons/*'],
        manifest: {
          name: 'BA Workspace – Project Intelligence Hub',
          short_name: 'BA Workspace',
          description: 'Project intelligence workspace for Business Analysts',
          theme_color: '#0f172a',
          background_color: '#ffffff',
          display: 'standalone',
          orientation: 'portrait-primary',
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: 'icons/icon-192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'icons/icon-512.png',
              sizes: '512x512',
              type: 'image/png'
            },
            {
              src: 'icons/icon-maskable.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable'
            }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
          navigateFallback: 'index.html',
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: /\/api\/login/i,
              handler: 'NetworkOnly'
            },
            {
              urlPattern: /\/api\/.*/i,
              handler: 'NetworkOnly'
            }
          ]
        }
      })
    ],
  };
});
