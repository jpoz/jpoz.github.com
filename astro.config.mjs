// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.jpoz.net',
  // Emit /resume.html instead of /resume/index.html so existing URLs keep working.
  build: { format: 'file' },
  markdown: {
    // Posts use their own <pre><code data-language> blocks; don't restyle fenced code.
    syntaxHighlight: false,
    smartypants: false,
  },
});
