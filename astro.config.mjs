// @ts-check
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import devEditor from './plugins/dev-editor.mjs';

// One build serves both www.jpoz.net and jpoz.com.
export default defineConfig({
  site: 'https://www.jpoz.net',
  // Emit /resume.html instead of /resume/index.html so existing URLs keep working.
  build: { format: 'file' },
  trailingSlash: 'never',
  // The about page was removed; send old links to the homepage.
  redirects: { '/about': '/' },
  vite: {
    plugins: [devEditor()],
    // Let `make dev` be reached over Tailscale by MagicDNS name, not just IP.
    server: { allowedHosts: ['.ts.net'] },
  },
  integrations: [sitemap(), mdx()],
  markdown: {
    shikiConfig: { theme: 'github-light', wrap: true },
    smartypants: false,
  },
});
