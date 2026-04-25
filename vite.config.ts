import { defineConfig, loadEnv } from 'vite';
import type { ViteDevServer } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import type { IncomingMessage, ServerResponse } from 'http';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  const mockAuthPlugin = () => ({
    name: 'mock-auth-plugin',
    configureServer(server: ViteDevServer) {
      server.middlewares.use('/api/login', (req: IncomingMessage, res: ServerResponse, next: () => void) => {
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
    plugins: [react(), tailwindcss(), mockAuthPlugin()],
  };
});
