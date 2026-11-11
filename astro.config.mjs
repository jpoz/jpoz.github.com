// @ts-check
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import AutoImport from 'astro-auto-import';
import { defineConfig } from 'astro/config';
import devEditor from './plugins/dev-editor.mjs';

// One build serves both www.jpoz.net and jpoz.com.
export default defineConfig({
  site: 'https://www.jpoz.net',
  // Emit /resume.html instead of /resume/index.html so existing URLs keep working.
  build: { format: 'file' },
  trailingSlash: 'never',
  vite: {
    plugins: [tailwindcss(), devEditor()],
    // Let `make dev` be reached over Tailscale by MagicDNS name, not just IP.
    server: { allowedHosts: ['.ts.net'] },
  },
  integrations: [
    react(),
    sitemap(),
    AutoImport({
      imports: [
        '@/shortcodes/Button',
        '@/shortcodes/Accordion',
        '@/shortcodes/Notice',
        '@/shortcodes/Video',
        '@/shortcodes/Youtube',
        '@/shortcodes/Tabs',
        '@/shortcodes/Tab',
        '@/shortcodes/CodeCompare',
      ],
    }),
    mdx(),
  ],
  markdown: {
    shikiConfig: { theme: 'one-dark-pro', wrap: true },
    smartypants: false,
  },
});
