import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname, relative } from 'path';
import { createRequire } from 'module';

const ROOT = process.cwd();
const SKIP = new Set(['node_modules', '.git', 'scripts']);
const issues = [];

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, files);
    else if (['.html', '.js', '.xml', '.txt', '.webmanifest', '.json'].includes(extname(name))) files.push(p);
  }
  return files;
}

const leftovers = ['ImoChat', 'imochat', 'OkoaChat', 'okoachat', 'MartinKe', '254101049310', '<<<<<<<', '>>>>>>>', 'Contact us'];
for (const file of walk(ROOT)) {
  const c = readFileSync(file, 'utf8');
  const rel = relative(ROOT, file).replace(/\\/g, '/');
  for (const b of leftovers) {
    if (c.includes(b)) issues.push(`leftover ${b} in ${rel}`);
  }
}

const html = readFileSync('index.html', 'utf8');
const about = readFileSync('about/index.html', 'utf8');
const contact = readFileSync('contact/index.html', 'utf8');
const homeJs = readFileSync('assets/index-BA91RANk.js', 'utf8');
const footerJs = readFileSync('assets/SiteFooter-BCEgAcxb.js', 'utf8');
const aboutJs = readFileSync('assets/about-xXvOyurZ.js', 'utf8');
const contactJs = readFileSync('assets/contact-Wz-2baKe.js', 'utf8');

const must = {
  'HTML title': html.includes('<title>DolaChat – Official Get Paid to Chat Platform</title>'),
  'HTML desc': html.includes(
    'Join DolaChat and get paid to chat with lonely foreigners. Instant withdrawals to M-Pesa, MoMo, bank accounts, and crypto.'
  ),
  'HTML footer': html.includes('© 2026 DolaChat. All rights reserved.'),
  'HTML Contact Us': html.includes('>Contact Us<'),
  'HTML WA': html.includes('https://wa.me/254748899010'),
  'HTML referral': html.includes('https://mulaearn.com/register.php?ref=Sheilajune'),
  'HTML domain': html.includes('dolachat.site'),
  'HTML display domain': html.includes('DolaChat') && html.includes('.Site'),
  'HTML logo path': html.includes('/denichat-logo.webp'),
  'HTML discover copy': html.includes("DolaChat is Kenya") || html.includes('DolaChat is Kenya'),
  'Home JS sr-only': homeJs.includes('DolaChat – Official Get Paid to Chat Platform'),
  'Home JS discover': homeJs.includes("DolaChat is Kenya's and Africa's leading platform"),
  'Home JS how': homeJs.includes('How DolaChat Works – Simple & Transparent'),
  'Home JS not footer-as-copy': !/sr-only",children:"© 2026/.test(homeJs),
  'Footer JS .Site': footerJs.includes('children:".Site"'),
  'Footer JS ref': footerJs.includes('ref=Sheilajune'),
  'Footer JS wa': footerJs.includes('https://wa.me/254748899010'),
  'Footer JS copyright only once as div': (footerJs.match(/children:"© 2026 DolaChat\. All rights reserved\."/g) || []).length === 1,
  'About JS title': aboutJs.includes('About DolaChat'),
  'About JS body': aboutJs.includes('Join DolaChat and get paid to chat with lonely foreigners'),
  'Contact JS title': contactJs.includes('Contact DolaChat'),
  'Contact JS email': contactJs.includes('mailto:nasimiyusheila1@gmail.com'),
  'Contact HTML email': contact.includes('mailto:nasimiyusheila1@gmail.com'),
  'About HTML brand': about.includes('DolaChat') && !about.includes('ImoChat'),
};

for (const [k, v] of Object.entries(must)) {
  if (!v) issues.push('FAILED ' + k);
}

const base = 'http://127.0.0.1:3001';
const pages = ['/', '/about', '/contact', '/terms', '/privacy', '/assets/styles-5F5pSNYI.css', '/assets/index-BA91RANk.js', '/manifest.webmanifest', '/sitemap.xml', '/robots.txt', '/denichat-logo.webp', '/favicon.ico'];

async function main() {
  for (const p of pages) {
    try {
      const res = await fetch(base + p);
      if (!res.ok) issues.push(`HTTP ${res.status} ${p}`);
      else console.log('HTTP', res.status, p);
    } catch (e) {
      issues.push(`FETCH FAIL ${p}: ${e.message}`);
    }
  }

  const home = await (await fetch(base + '/')).text();
  console.log('served title', (home.match(/<title>[^<]+<\/title>/) || [])[0]);
  console.log('served desc', (home.match(/name="description" content="[^"]+"/) || [])[0]);
  console.log('served footer', home.includes('© 2026 DolaChat. All rights reserved.'));
  console.log('served contact us', home.includes('>Contact Us<'));
  console.log('served wa', home.includes('https://wa.me/254748899010'));
  console.log('served ref', home.includes('https://mulaearn.com/register.php?ref=Sheilajune'));
  console.log('served email mailto on contact page check next');

  const contactPage = await (await fetch(base + '/contact')).text();
  console.log('contact mailto', contactPage.includes('mailto:nasimiyusheila1@gmail.com'));
  console.log('contact us btn', contactPage.includes('>Contact Us<'));

  console.log('\nISSUES', issues.length ? issues : 'NONE');
  if (issues.length) process.exitCode = 1;
}

main();
