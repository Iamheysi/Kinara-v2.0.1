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
          // loadEnv reads .env files; process.env catches Vercel/CI injected vars.
          // Vercel's Supabase integration uses non-prefixed names (SUPABASE_URL),
          // while local dev uses VITE_ prefixed names — check both.
          const url = env.VITE_SUPABASE_URL
            || process.env.VITE_SUPABASE_URL
            || process.env.SUPABASE_URL
            || '';
          const key = env.VITE_SUPABASE_ANON_KEY
            || process.env.VITE_SUPABASE_ANON_KEY
            || process.env.SUPABASE_ANON_KEY
            || '';

          if (!url || !key) {
            console.warn('[Kinara] Supabase credentials not found at build time. '
              + 'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.');
          }

          return html.replace(
            '<script src="/config.js"></script>',
            `<script>const SUPA_URL="${url}";const SUPA_KEY="${key}";</script>`
          );
        },
      },
    ],
  }
})
