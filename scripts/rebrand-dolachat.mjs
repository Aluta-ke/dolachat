import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname, relative } from 'path';

const ROOT = process.cwd();
const SKIP = new Set(['node_modules', '.git', 'scripts']);
const TEXT_EXTS = new Set(['.html', '.js', '.css', '.xml', '.txt', '.webmanifest', '.json']);

const NEW_REG = 'https://mulaearn.com/register.php?ref=Sheilajune';
const NEW_WA = 'https://wa.me/254748899010';
const NEW_EMAIL = 'nasimiyusheila1@gmail.com';
const NEW_MAILTO = `mailto:${NEW_EMAIL}`;
const SEO_TITLE = 'DolaChat – Official Get Paid to Chat Platform';
const SEO_DESC =
  'Join DolaChat and get paid to chat with lonely foreigners. Instant withdrawals to M-Pesa, MoMo, bank accounts, and crypto.';
const FOOTER = '© 2026 DolaChat. All rights reserved.';
const DOMAIN = 'dolachat.site';
const DISPLAY_DOMAIN = 'DolaChat.Site';

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, files);
    else if (TEXT_EXTS.has(extname(name))) files.push(p);
  }
  return files;
}

function resolveConflicts(content) {
  if (!content.includes('<<<<<<<')) return content;
  return content.replace(
    /<<<<<<< HEAD\r?\n([\s\S]*?)\r?\n=======\r?\n[\s\S]*?\r?\n>>>>>>> [^\r\n]+/g,
    '$1'
  );
}

function replaceWhatsApp(c) {
  c = c.replace(/https:\/\/wa\.me\/254\d{9}(?:\?[^"'\\\s]*)?/g, NEW_WA);
  c = c.replace(/https:\/\/whatsapp\.com\/channel\/[A-Za-z0-9]+/g, NEW_WA);
  c = c.replace(/https:\/\/chat\.whatsapp\.com\/[A-Za-z0-9]+/g, NEW_WA);
  return c;
}

function replaceReferrals(c) {
  c = c.replace(/https:\/\/mulaearn\.com\/register\.php\?ref=[A-Za-z0-9_-]+/g, NEW_REG);
  c = c.replace(/https:\/\/mula-prime\.com\/user\/register\.php\?ref=[A-Za-z0-9_-]+/g, NEW_REG);
  c = c.replace(/https:\/\/starhela\.com\/register\.php\?ref=[A-Za-z0-9_-]+/g, NEW_REG);
  c = c.replace(/https:\/\/star-hela\.com\/register\.php\?ref=[A-Za-z0-9_-]+/g, NEW_REG);
  return c;
}

function protectLogoPaths(c) {
  return c
    .replaceAll('/assets/denichat-logo-CnMczFfq.webp', '@@LOGO_ASSET@@')
    .replaceAll('/denichat-logo.webp', '@@LOGO_ROOT@@')
    .replaceAll('denichat-logo.webp', '@@LOGO_FILE@@');
}

function restoreLogoPaths(c) {
  return c
    .replaceAll('@@LOGO_ASSET@@', '/assets/denichat-logo-CnMczFfq.webp')
    .replaceAll('@@LOGO_ROOT@@', '/denichat-logo.webp')
    .replaceAll('@@LOGO_FILE@@', 'denichat-logo.webp');
}

function replaceBrand(c) {
  c = protectLogoPaths(c);
  const pairs = [
    ['ImoChat.Site', DISPLAY_DOMAIN],
    ['ImoChat Site', 'DolaChat'],
    ['ImoChat', 'DolaChat'],
    ['imochat.Site', DISPLAY_DOMAIN],
    ['imochat.site', DOMAIN],
    ['imochat', 'dolachat'],
    ['OkoaChat.Site', DISPLAY_DOMAIN],
    ['OkoaChat Site', 'DolaChat'],
    ['OkoaChat', 'DolaChat'],
    ['okoachat.Site', DISPLAY_DOMAIN],
    ['okoachat.site', DOMAIN],
    ['okoachat', 'dolachat'],
    ['IncomeLink.Site', DISPLAY_DOMAIN],
    ['IncomeLink Site', 'DolaChat'],
    ['IncomeLink', 'DolaChat'],
    ['Incomelink', 'DolaChat'],
    ['incomelink.Site', DISPLAY_DOMAIN],
    ['incomelink.site', DOMAIN],
    ['incomelink', 'dolachat'],
    ['Polimu.Site', DISPLAY_DOMAIN],
    ['Polimu Site', 'DolaChat'],
    ['Polimu', 'DolaChat'],
    ['polimu.site', DOMAIN],
    ['polimu', 'dolachat'],
    ['Deni Chat', 'DolaChat'],
  ];
  for (const [from, to] of pairs) c = c.split(from).join(to);
  return restoreLogoPaths(c);
}

function replaceEmails(c) {
  const keep = new Set([
    NEW_EMAIL,
    'schema.org',
    'w3.org',
    'example.com',
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'www.googletagmanager.com',
  ]);
  c = c.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, (m) => {
    if (m === NEW_EMAIL) return m;
    if ([...keep].some((k) => m.includes(k))) return m;
    if (m.includes('schema.org') || m.includes('w3.org')) return m;
    return NEW_EMAIL;
  });
  c = c.replace(/mailto:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, NEW_MAILTO);
  return c;
}

function replaceFooter(c) {
  c = c.replace(/<div>(?:&copy;|©)\s*[^<]*<\/div>/g, (m) => {
    if (/2026|rights reserved|DolaChat|ImoChat|OkoaChat|Site|incomelink|Polimu/i.test(m)) {
      return `<div>${FOOTER}</div>`;
    }
    return m;
  });
  c = c.replace(/children:"(?:©|&copy;|\\u00a9)?[^"]*DolaChat[^"]*"/g, `children:"${FOOTER}"`);
  c = c.replace(/children:"(?:©|&copy;|\\u00a9)?[^"]*(?:ImoChat|OkoaChat|Site)[^"]*"/g, `children:"${FOOTER}"`);
  c = c.replace(/>©[^<]*</g, (m) => {
    if (/2026|rights reserved|DolaChat|ImoChat|OkoaChat|Site/i.test(m)) return `>${FOOTER}<`;
    return m;
  });
  return c;
}

function transform(content, rel) {
  let c = resolveConflicts(content);
  c = replaceReferrals(c);
  c = replaceWhatsApp(c);
  c = replaceBrand(c);
  c = replaceEmails(c);
  c = replaceFooter(c);
  c = c.split('Contact us').join('Contact Us');

  if (rel === 'index.html') {
    c = c.replace(/<title>[^<]*<\/title>/, `<title>${SEO_TITLE}</title>`);
    c = c.replace(/name="description" content="[^"]*"/, `name="description" content="${SEO_DESC}"`);
    c = c.replace(/property="og:title" content="[^"]*"/, `property="og:title" content="${SEO_TITLE}"`);
    c = c.replace(/property="og:description" content="[^"]*"/, `property="og:description" content="${SEO_DESC}"`);
    c = c.replace(/name="twitter:title" content="[^"]*"/, `name="twitter:title" content="${SEO_TITLE}"`);
    c = c.replace(/name="twitter:description" content="[^"]*"/, `name="twitter:description" content="${SEO_DESC}"`);
    c = c.replace(/property="og:url" content="[^"]*"/, `property="og:url" content="https://${DOMAIN}/"`);
    c = c.replace(/property="og:site_name" content="[^"]*"/, 'property="og:site_name" content="DolaChat"');
    c = c.replace(/<h1 class="sr-only">[^<]*<\/h1>/, '<h1 class="sr-only">DolaChat – Official Get Paid to Chat Platform</h1>');
  }

  if (rel === 'about/index.html') {
    c = c.replace(
      /<p class="mt-4 text-base text-muted">[\s\S]*?<\/p>/,
      '<p class="mt-4 text-base text-muted">Join DolaChat and get paid to chat with lonely foreigners. Instant withdrawals to M-Pesa, MoMo, bank accounts, and crypto.</p>'
    );
  }

  if (rel === 'contact/index.html') {
    c = c.replace(
      /<li>Email — [^<]*<\/li>/,
      `<li>Email — <a href="${NEW_MAILTO}">${NEW_EMAIL}</a></li>`
    );
  }

  if (rel === 'assets/contact-Wz-2baKe.js') {
    c = c.replace(
      /children:"Email — [^"]*"/,
      `children:["Email — ",t.jsx("a",{href:"${NEW_MAILTO}",children:"${NEW_EMAIL}"})]`
    );
  }

  if (rel === 'pwa-install.js') {
    c = c.replace(/Install DolaChat/g, 'Install DolaChat');
    c = c.replace(/To install DolaChat:/g, 'To install DolaChat:');
    c = c.replace(/alt="DolaChat logo"/g, 'alt="DolaChat logo"');
  }

  return c;
}

const files = walk(ROOT);
let changed = 0;
for (const file of files) {
  const rel = relative(ROOT, file).replace(/\\/g, '/');
  const before = readFileSync(file, 'utf8');
  const after = transform(before, rel);
  if (after !== before) {
    writeFileSync(file, after);
    changed++;
    console.log('updated', rel);
  }
}

writeFileSync(
  join(ROOT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://${DOMAIN}/</loc><lastmod>2026-09-07</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>https://${DOMAIN}/about</loc><lastmod>2026-09-07</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://${DOMAIN}/contact</loc><lastmod>2026-09-07</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://${DOMAIN}/terms</loc><lastmod>2026-09-07</lastmod><changefreq>yearly</changefreq><priority>0.3</priority></url>
  <url><loc>https://${DOMAIN}/privacy</loc><lastmod>2026-09-07</lastmod><changefreq>yearly</changefreq><priority>0.3</priority></url>
</urlset>
`
);

writeFileSync(
  join(ROOT, 'robots.txt'),
  `User-agent: *
Allow: /
Disallow: /auth
Disallow: /dashboard

# IndexNow
# Key file: /a74ecba8ce6ac217564cdad2e9d5602d.txt

Sitemap: https://${DOMAIN}/sitemap.xml
Host: ${DOMAIN}
`
);

writeFileSync(
  join(ROOT, 'manifest.webmanifest'),
  `{
  "name": "DolaChat",
  "short_name": "DolaChat",
  "description": "Join DolaChat and get paid to chat with lonely foreigners. Instant withdrawals to M-Pesa, MoMo, bank accounts, and crypto.",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#ffffff",
  "theme_color": "#0E7C7B",
  "icons": [
    {
      "src": "/favicon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/favicon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/favicon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ]
}
`
);

writeFileSync(
  join(ROOT, 'package.json'),
  `{
  "name": "dolachat",
  "version": "1.0.0",
  "private": true,
  "description": "DolaChat static site",
  "scripts": {
    "start": "npx --yes serve -l 3000"
  }
}
`
);

console.log('Changed files:', changed);
console.log('Wrote sitemap, robots, manifest, package.json');
