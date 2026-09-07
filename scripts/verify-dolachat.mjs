import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname, relative } from 'path';

const ROOT = process.cwd();
const SKIP = new Set(['node_modules', '.git', 'scripts']);

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, files);
    else if (['.html', '.js', '.css', '.xml', '.txt', '.webmanifest', '.json'].includes(extname(name)))
      files.push(p);
  }
  return files;
}

const leftovers = [
  'ImoChat', 'imochat', 'OkoaChat', 'okoachat', 'IncomeLink', 'incomelink',
  'Polimu', 'polimu', 'MartinKe', 'Onlinetasks', 'FLIRTCHAT',
  '254101049310', '254798106328', '254707156110', '254116906441',
  '<<<<<<<', '=======', '>>>>>>>',
  'Contact us',
];

const required = {
  'DolaChat': 0,
  'dolachat.site': 0,
  'DolaChat.Site': 0,
  'https://wa.me/254748899010': 0,
  'https://mulaearn.com/register.php?ref=Sheilajune': 0,
  'nasimiyusheila1@gmail.com': 0,
  'mailto:nasimiyusheila1@gmail.com': 0,
  'Contact Us': 0,
  '© 2026 DolaChat. All rights reserved.': 0,
};

const leftoverHits = [];
for (const file of walk(ROOT)) {
  const c = readFileSync(file, 'utf8');
  const rel = relative(ROOT, file).replace(/\\/g, '/');
  for (const b of leftovers) {
    if (c.includes(b)) leftoverHits.push(`${rel}: ${b}`);
  }
  for (const k of Object.keys(required)) {
    const n = c.split(k).length - 1;
    if (n) required[k] += n;
  }
}

const html = readFileSync(join(ROOT, 'index.html'), 'utf8');
const about = readFileSync(join(ROOT, 'about/index.html'), 'utf8');
const contact = readFileSync(join(ROOT, 'contact/index.html'), 'utf8');
const footerJs = readFileSync(join(ROOT, 'assets/SiteFooter-BCEgAcxb.js'), 'utf8');
const homeJs = readFileSync(join(ROOT, 'assets/index-BA91RANk.js'), 'utf8');
const contactJs = readFileSync(join(ROOT, 'assets/contact-Wz-2baKe.js'), 'utf8');

const checks = {
  title: html.includes('<title>DolaChat – Official Get Paid to Chat Platform</title>'),
  desc: html.includes(
    'Join DolaChat and get paid to chat with lonely foreigners. Instant withdrawals to M-Pesa, MoMo, bank accounts, and crypto.'
  ),
  ogTitle: html.includes('property="og:title" content="DolaChat – Official Get Paid to Chat Platform"'),
  ogDesc: html.includes(
    'property="og:description" content="Join DolaChat and get paid to chat with lonely foreigners. Instant withdrawals to M-Pesa, MoMo, bank accounts, and crypto."'
  ),
  canonical: html.includes('rel="canonical" href="https://dolachat.site/"'),
  footerHtml: html.includes('© 2026 DolaChat. All rights reserved.'),
  contactBtn: html.includes('>Contact Us<'),
  waHome: html.includes('https://wa.me/254748899010'),
  refHome: html.includes('https://mulaearn.com/register.php?ref=Sheilajune'),
  oldWaGone: !html.includes('254101049310') && !html.includes('MartinKe'),
  logoPath: html.includes('/assets/denichat-logo-CnMczFfq.webp') && html.includes('/denichat-logo.webp'),
  aboutBrand: about.includes('DolaChat') && !about.includes('ImoChat'),
  contactEmail: contact.includes('mailto:nasimiyusheila1@gmail.com'),
  contactEmailText: contact.includes('nasimiyusheila1@gmail.com'),
  footerJsRef: footerJs.includes('https://mulaearn.com/register.php?ref=Sheilajune'),
  footerJsWa: footerJs.includes('https://wa.me/254748899010'),
  footerJsCopy: footerJs.includes('© 2026 DolaChat. All rights reserved.'),
  homeJsBrand: homeJs.includes('DolaChat') && !homeJs.includes('ImoChat'),
  contactJsEmail: contactJs.includes('mailto:nasimiyusheila1@gmail.com'),
  robots: readFileSync(join(ROOT, 'robots.txt'), 'utf8').includes('dolachat.site'),
  sitemap: readFileSync(join(ROOT, 'sitemap.xml'), 'utf8').includes('https://dolachat.site/'),
  manifest: readFileSync(join(ROOT, 'manifest.webmanifest'), 'utf8').includes('"name": "DolaChat"'),
  conflictsGone: leftoverHits.filter((x) => x.includes('<<<') || x.includes('=======') || x.includes('>>>')).length === 0,
};

console.log(JSON.stringify({ leftoverHits, required, checks }, null, 2));

const failed = Object.entries(checks).filter(([, v]) => !v);
if (failed.length || leftoverHits.length) {
  console.log('\nFAILED CHECKS:', failed.map(([k]) => k));
  process.exitCode = leftoverHits.length || failed.length ? 1 : 0;
} else {
  console.log('\nALL CHECKS PASSED');
}
