import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      {
        name: 'inject-supabase-config',
        transformIndexHtml(html) {
          // loadEnv reads .env files; process.env catches Vercel/CI injected vars
          const url = env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
          const key = env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
          return html.replace(
            '<script src="/config.js"></script>',
            `<script>const SUPA_URL="${url}";const SUPA_KEY="${key}";</script>`
          );
        },
      },
    ],
  }
})
