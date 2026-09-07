import { readFileSync, writeFileSync } from 'fs';

function replaceOnce(file, start, end, replacement) {
  let c = readFileSync(file, 'utf8');
  const i = c.indexOf(start);
  if (i < 0) {
    console.log('NO START', file, start);
    return;
  }
  const j = c.indexOf(end, i + start.length);
  if (j < 0) {
    console.log('NO END', file, end);
    return;
  }
  const old = c.slice(i, j + end.length);
  console.log('OLD', file, JSON.stringify(old));
  c = c.slice(0, i) + replacement + c.slice(j + end.length);
  writeFileSync(file, c);
  console.log('OK', file);
}

replaceOnce(
  'assets/index-BA91RANk.js',
  'n.jsx("h1",{className:"sr-only",children:"',
  '"})',
  'n.jsx("h1",{className:"sr-only",children:"DolaChat – Official Get Paid to Chat Platform"})'
);

replaceOnce(
  'assets/about-xXvOyurZ.js',
  'e.jsx("h1",{className:"font-display text-3xl font-extrabold sm:text-4xl",children:"',
  '"})',
  'e.jsx("h1",{className:"font-display text-3xl font-extrabold sm:text-4xl",children:"About DolaChat"})'
);

replaceOnce(
  'assets/about-xXvOyurZ.js',
  'e.jsx("p",{className:"mt-4 text-base text-muted",children:"',
  '"})',
  'e.jsx("p",{className:"mt-4 text-base text-muted",children:"Join DolaChat and get paid to chat with lonely foreigners. Instant withdrawals to M-Pesa, MoMo, bank accounts, and crypto."})'
);

replaceOnce(
  'assets/contact-Wz-2baKe.js',
  't.jsx("h1",{className:"font-display text-3xl font-extrabold sm:text-4xl",children:"',
  '"})',
  't.jsx("h1",{className:"font-display text-3xl font-extrabold sm:text-4xl",children:"Contact DolaChat"})'
);
