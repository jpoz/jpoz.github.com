Optimize all images in `public/images/` for the web. Follow these steps:

1. **Find unoptimized images**: Look for PNG and JPG/JPEG files in `public/images/` that are candidates for optimization. Skip `favicon.png`, `logo.png`, and `image-placeholder.png` since those are already small.

2. **Convert large PNGs to WebP**: For any PNG file over 100KB, convert it to WebP using `cwebp -q 80`. If the image is wider than 1600px, also resize it with `-resize 1600 0`. For author/avatar images (in `public/images/` root or `public/images/authors/`), resize to max 800px wide with `-resize 800 0`.

3. **Optimize JPGs**: For any JPG/JPEG file, use `magick` (ImageMagick) to strip metadata and compress to quality 80. If the image is larger than 1600px wide (or 800px for author/avatar images), resize it down.

4. **Update references**: Search all `.md`, `.mdx`, `.json`, `.ts`, `.tsx` files in `src/` for references to the old PNG filenames and update them to point to the new `.webp` files. JPG filenames stay the same since we optimize in-place.

5. **Remove old PNGs**: Delete the original PNG files that were converted to WebP.

6. **Report results**: Show a before/after summary table with file names, old sizes, new sizes, and percentage savings.

Requirements:
- `cwebp` must be installed (from `webp` package)
- `magick` (ImageMagick v7) must be installed
- Both are available via Homebrew: `brew install webp imagemagick`
