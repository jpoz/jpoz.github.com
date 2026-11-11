import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;
export type LegacyPost = CollectionEntry<'blog'>;

export const SITE_URL = 'https://jpoz.com';
export const PER_PAGE = 20;

/** Published posts, newest first. Drafts show up in `astro dev` only. */
export async function getPosts(): Promise<Post[]> {
  const all = await getCollection('posts', (p) => import.meta.env.DEV || p.data.draft !== true);
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** Old jpoz.net posts that were published, newest first. Dates come from the file name. */
export async function getLegacyPosts(): Promise<LegacyPost[]> {
  const all = await getCollection('blog', (p) => p.data.published !== false);
  return all.sort((a, b) => b.id.localeCompare(a.id));
}

export const legacyDate = (p: LegacyPost) => new Date(p.id.slice(0, 10) + 'T12:00:00Z');

export const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^\p{L}\p{N}\s-]/gu, '').replace(/\s+/g, '-');

// tags and categories are stored lowercase; restore the usual casing of acronyms
const CASING: Record<string, string> = { ai: 'AI', llm: 'LLM', llms: 'LLMs', json: 'JSON', xml: 'XML', xlsx: 'XLSX', wasm: 'Wasm', api: 'API', apis: 'APIs', ui: 'UI', cli: 'CLI', go: 'Go' };
export const humanize = (s: string) =>
  s.replace(/[-_]+/g, ' ')
    .replace(/\p{L}[\p{L}\d]*/gu, (w) => CASING[w.toLowerCase()] ?? w)
    .replace(/^\p{L}/u, (c) => c.toUpperCase());

/** 2026.10.15 */
export const formatDate = (d: Date) =>
  `${d.getUTCFullYear()}.${String(d.getUTCMonth() + 1).padStart(2, '0')}.${String(d.getUTCDate()).padStart(2, '0')}`;

const plain = (md: string) =>
  md
    .replace(/^import .*$/gm, '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[\^[^\]]*\]:?/g, '')
    .replace(/[#>*_`~|]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

export const readingMinutes = (md = '') => Math.max(1, Math.round(plain(md).split(' ').length / 230));

export function summary(post: Post, length = 180) {
  if (post.data.description && post.data.description !== 'meta description') return post.data.description;
  const text = plain(post.body ?? '');
  return text.length > length ? text.slice(0, length).replace(/\s+\S*$/, '') + '…' : text;
}

/** Posts sharing the most tags/categories with `post`. */
export function related(post: Post, posts: Post[], n = 3) {
  const terms = new Set([...post.data.tags, ...post.data.categories].map(slugify));
  return posts
    .filter((p) => p.id !== post.id)
    .map((p) => ({ p, score: [...p.data.tags, ...p.data.categories].filter((t) => terms.has(slugify(t))).length }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || b.p.data.date.getTime() - a.p.data.date.getTime())
    .slice(0, n)
    .map((x) => x.p);
}

/** Every tag (or category) with its posts, most used first. */
export function taxonomy(posts: Post[], key: 'tags' | 'categories') {
  const map = new Map<string, { name: string; posts: Post[] }>();
  for (const p of posts)
    for (const t of p.data[key]) {
      const slug = slugify(t);
      if (!map.has(slug)) map.set(slug, { name: humanize(t), posts: [] });
      map.get(slug)!.posts.push(p);
    }
  return [...map.entries()]
    .map(([slug, v]) => ({ slug, ...v }))
    .sort((a, b) => b.posts.length - a.posts.length || a.slug.localeCompare(b.slug));
}
