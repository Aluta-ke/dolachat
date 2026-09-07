import { readFileSync, writeFileSync } from 'fs';

const FOOTER = '© 2026 DolaChat. All rights reserved.';
const SEO_TITLE = 'DolaChat – Official Get Paid to Chat Platform';
const SEO_DESC =
  'Join DolaChat and get paid to chat with lonely foreigners. Instant withdrawals to M-Pesa, MoMo, bank accounts, and crypto.';

function patch(file, replacements) {
  let c = readFileSync(file, 'utf8');
  const before = c;
  for (const [from, to] of replacements) {
    if (!c.includes(from)) {
      console.log('MISSING in', file, '::', from.slice(0, 80));
      continue;
    }
    const count = c.split(from).length - 1;
    c = c.split(from).join(to);
    console.log('patched', file, 'x' + count, from.slice(0, 60));
  }
  if (c !== before) writeFileSync(file, c);
}

const child = (text) => `children:"${text}"`;
const footerChild = child(FOOTER);

patch('assets/index-BA91RANk.js', [
  [
    'n.jsx("h1",{className:"sr-only",' + footerChild + ')',
    'n.jsx("h1",{className:"sr-only",' + child(SEO_TITLE) + ')',
  ],
  [
    'className:"mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base",' + footerChild + '}),n.jsxs("ul"',
    'className:"mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base",' +
      child(
        "DolaChat is Kenya's and Africa's leading platform connecting you with genuine foreigners who want meaningful conversations. Whether you're in Nairobi, Accra, Lagos or Kampala, you can start earning real money from the comfort of your phone."
      ) +
      '}),n.jsxs("ul"',
  ],
  [
    'className:"mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base",' + footerChild + '})]})}function pr()',
    'className:"mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base",' +
      child('Thousands of Africans are already earning extra income every week on DolaChat.') +
      '})]})}function pr()',
  ],
  [
    'className:"font-display text-xl font-extrabold text-foreground sm:text-2xl",' + footerChild + '}),n.jsx("p",{className:"mt-3 text-sm l',
    'className:"font-display text-xl font-extrabold text-foreground sm:text-2xl",' +
      child('How DolaChat Works – Simple & Transparent') +
      '}),n.jsx("p",{className:"mt-3 text-sm l',
  ],
  [
    'className:"mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base",' + footerChild + '})]})}function fr()',
    'className:"mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base",' +
      child(
        'Getting started on DolaChat takes less than 30 seconds. Sign up for free, get matched with real people from USA, UK, Germany, Canada and other countries who are willing to pay for friendly chats. Every message you send can earn you money. Our system ensures fair matching and secure payments. Many users in Kenya are earning between KSh 2,000 to KSh 15,000+ per week depending on how active they are.'
      ) +
      '})]})}function fr()',
  ],
  [
    'className:"mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base",' + footerChild + '}),n.jsxs("div",{className:"mt-4 rounde',
    'className:"mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base",' +
      child(
        "DolaChat has already paid out over $1.2 Million to chatters across Africa. Here's what our community is saying:"
      ) +
      '}),n.jsxs("div",{className:"mt-4 rounde',
  ],
  [
    'className:"text-sm font-semibold text-foreground sm:text-base",' + footerChild,
    'className:"text-sm font-semibold text-foreground sm:text-base",' + child('Why members love DolaChat:'),
  ],
  [
    'className:"mt-2 text-sm text-muted-foreground",' + footerChild,
    'className:"mt-2 text-sm text-muted-foreground",' +
      child('Everything you need to know before you start chatting and earning on DolaChat.'),
  ],
]);

patch('assets/SiteFooter-BCEgAcxb.js', [
  [
    'e.jsx("span",{className:"text-coral",' + footerChild + '})',
    'e.jsx("span",{className:"text-coral",' + child('.Site') + '})',
  ],
]);

patch('assets/about-xXvOyurZ.js', [
  [
    'e.jsx("h1",{className:"font-display text-3xl font-extrabold sm:text-4xl",' + footerChild + ')',
    'e.jsx("h1",{className:"font-display text-3xl font-extrabold sm:text-4xl",' + child('About DolaChat') + ')',
  ],
  [
    'e.jsx("p",{className:"mt-4 text-base text-muted",' + footerChild + ')',
    'e.jsx("p",{className:"mt-4 text-base text-muted",' + child(SEO_DESC) + ')',
  ],
]);

patch('assets/contact-Wz-2baKe.js', [
  [
    't.jsx("h1",{className:"font-display text-3xl font-extrabold sm:text-4xl",' + footerChild + ')',
    't.jsx("h1",{className:"font-display text-3xl font-extrabold sm:text-4xl",' + child('Contact DolaChat') + ')',
  ],
]);

patch('assets/terms-DX1bOgGE.js', [
  [
    'e.jsx("p",{className:"mt-2 text-muted",' +
      footerChild +
      '}),e.jsx("h2",{className:"mt-8 font-display text-xl font-bold",children:"2. Eligibility"})',
    'e.jsx("p",{className:"mt-2 text-muted",' +
      child('By creating an account on DolaChat you agree to these Terms of Service and our Privacy Policy.') +
      '}),e.jsx("h2",{className:"mt-8 font-display text-xl font-bold",children:"2. Eligibility"})',
  ],
  [
    'e.jsx("p",{className:"mt-2 text-muted",' +
      footerChild +
      '}),e.jsx("h2",{className:"mt-8 font-display text-xl font-bold",children:"3. Earnings and Withdrawals"})',
    'e.jsx("p",{className:"mt-2 text-muted",' +
      child('You must be at least 18 years old to use DolaChat. Accounts found in violation will be suspended.') +
      '}),e.jsx("h2",{className:"mt-8 font-display text-xl font-bold",children:"3. Earnings and Withdrawals"})',
  ],
  [
    'e.jsx("p",{className:"mt-2 text-muted",' +
      footerChild +
      '}),e.jsx("div",{className:"mt-10"',
    'e.jsx("p",{className:"mt-2 text-muted",' +
      child('We may update these terms periodically. Continued use of DolaChat constitutes acceptance of the updated terms.') +
      '}),e.jsx("div",{className:"mt-10"',
  ],
]);

patch('assets/privacy-CTW2ydfS.js', [
  [
    'e.jsx("p",{className:"mt-2 text-muted",' + footerChild + '}),e.jsx("h2",{className:"mt-8 font-display text-xl font-bold",children:"Data Security"})',
    'e.jsx("p",{className:"mt-2 text-muted",' +
      child(
        'To operate your account, match you with chat partners, process withdrawals, and improve DolaChat. We never sell your personal information.'
      ) +
      '}),e.jsx("h2",{className:"mt-8 font-display text-xl font-bold",children:"Data Security"})',
  ],
]);

let vendor = readFileSync('assets/index-BxJ28E2m.js', 'utf8');
const longTitle = 'DolaChat - Official Get Paid to Chat Platform in Kenya & Africa | Earn via M-Pesa';
const longTitleEsc = 'DolaChat - Official Get Paid to Chat Platform in Kenya \\x26 Africa | Earn via M-Pesa';
let vCount = 0;
if (vendor.includes(longTitle)) {
  vendor = vendor.split(longTitle).join(SEO_TITLE);
  vCount++;
}
if (vendor.includes(longTitleEsc)) {
  vendor = vendor.split(longTitleEsc).join(SEO_TITLE);
  vCount++;
}
const oldDescSnippets = [
  'Join DolaChat, the trusted platform where Africans get paid to chat with lonely foreigners. Instant withdrawals to M-Pesa, MoMo, bank or crypto. Over 80,000 users earning daily. Start chatting and earning today!',
  'Join DolaChat, the trusted platform where Africans get paid to chat with lonely foreigners. Instant withdrawals to M-Pesa, MoMo, bank or crypto. Over 80,000 users earning daily.',
  'Join DolaChat, the trusted platform where Africans get paid to chat with lonely foreigners. Instant withdrawals to M-Pesa, MoMo, bank or crypto.',
];
for (const s of oldDescSnippets) {
  if (vendor.includes(s)) {
    vendor = vendor.split(s).join(SEO_DESC);
    vCount++;
    console.log('vendor desc patched');
  }
}
writeFileSync('assets/index-BxJ28E2m.js', vendor);
console.log('vendor long-title patches attempted, file written. remaining long title?', vendor.includes(longTitle));

// leftover footer children that are NOT the real footer div
const files = [
  'assets/index-BA91RANk.js',
  'assets/SiteFooter-BCEgAcxb.js',
  'assets/about-xXvOyurZ.js',
  'assets/contact-Wz-2baKe.js',
  'assets/terms-DX1bOgGE.js',
  'assets/privacy-CTW2ydfS.js',
];
for (const f of files) {
  const c = readFileSync(f, 'utf8');
  const idxs = [];
  let i = 0;
  while ((i = c.indexOf(FOOTER, i)) !== -1) {
    idxs.push(c.slice(Math.max(0, i - 70), i + FOOTER.length + 20));
    i += FOOTER.length;
  }
  console.log('\nLEFT', f, idxs.length);
  idxs.forEach((s, n) => console.log(n, JSON.stringify(s)));
}
