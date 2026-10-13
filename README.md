# jpoz.net

Source for https://www.jpoz.net/, built with [Astro](https://astro.build).

```sh
npm install
npm run dev      # local server at http://localhost:4321
npm run build    # static output in dist/
```

- `src/pages/` pages, served as `/<name>.html`
- `src/content/blog/` blog posts, served as `/blog/<file>.html`
- `public/` static files copied as-is (CNAME, images, scripts, etc.)

Pushing to `source` deploys to GitHub Pages via `.github/workflows/deploy.yml`.
