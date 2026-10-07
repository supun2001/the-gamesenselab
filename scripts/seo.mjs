import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { pages } from '../src/config/pages.ts'
const rawDomain = process.env.VITE_SITE_URL?.replace(/\/$/, '') || ''
let domain = ''
if (rawDomain) {
  const url = new URL(rawDomain)
  if (
    url.protocol !== 'https:' ||
    url.pathname !== '/' ||
    url.search ||
    url.hash ||
    url.username ||
    url.password
  )
    throw new Error('VITE_SITE_URL must be a real HTTPS origin.')
  domain = url.origin
}
const escape = (value) =>
  value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;')
const base = await readFile('dist/index.html', 'utf8')
for (const page of pages) {
  const noindex = !domain || ['/privacy', '/terms'].includes(page.path)
  let html = base.replace(/<title>.*?<\/title>/, `<title>${escape(page.title)}</title>`)
  for (const [key, value] of [
    ['name="description"', page.description],
    ['property="og:title"', page.title],
    ['property="og:description"', page.description],
    ['name="twitter:title"', page.title],
    ['name="twitter:description"', page.description],
    ['name="robots"', noindex ? 'noindex, nofollow' : 'index, follow'],
    ['property="og:url"', domain ? domain + page.path : ''],
    ['property="og:image"', domain ? domain + '/brand/social-preview.png' : ''],
  ]) {
    html = html.replace(
      new RegExp(`(<meta\\s+${key}\\s+content=")[^"]*("\\s*/?>)`),
      `$1${escape(value)}$2`,
    )
  }
  if (domain)
    html = html.replace('</head>', `<link rel="canonical" href="${domain}${page.path}"/>\n</head>`)
  const directory = page.path === '/' ? 'dist' : `dist${page.path}`
  await mkdir(directory, { recursive: true })
  await writeFile(`${directory}/index.html`, html)
}
await writeFile(
  'dist/robots.txt',
  domain
    ? `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /privacy\nDisallow: /terms\nSitemap: ${domain}/sitemap.xml\n`
    : 'User-agent: *\nDisallow: /\n',
)
await writeFile(
  'dist/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${
    domain
      ? pages
          .filter((p) => !['/privacy', '/terms'].includes(p.path))
          .map((p) => `<url><loc>${domain}${p.path}</loc></url>`)
          .join('')
      : ''
  }</urlset>`,
)
await writeFile(
  'dist/404.html',
  base.replace(/<title>.*?<\/title>/, '<title>Page not found — Altheia</title>'),
)
console.log(
  domain
    ? 'Route metadata, canonical URLs and sitemap generated.'
    : 'Preview metadata generated; indexing disabled until VITE_SITE_URL is set.',
)
