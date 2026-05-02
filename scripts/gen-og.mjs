// Run: node scripts/gen-og.mjs
// Requires: npm install -D sharp  (in client/ or root)
import sharp from 'sharp';
import { writeFileSync, mkdirSync } from 'fs';

const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#07070c"/>
      <stop offset="100%" style="stop-color:#0f0f1a"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#6366f1"/>
      <stop offset="100%" style="stop-color:#a855f7"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="0" y="0" width="1200" height="4" fill="url(#accent)"/>
  <rect x="60" y="120" width="64" height="64" rx="16" fill="url(#accent)"/>
  <text x="148" y="167" font-family="sans-serif" font-weight="800" font-size="52" fill="white">ReplyAI</text>
  <text x="60" y="280" font-family="sans-serif" font-weight="800" font-size="64" fill="white">Write better emails.</text>
  <text x="60" y="355" font-family="sans-serif" font-weight="800" font-size="64" fill="#6366f1">In seconds.</text>
  <text x="60" y="450" font-family="sans-serif" font-size="28" fill="#9090a8">AI generates 3 polished reply drafts — free to start.</text>
  <text x="60" y="560" font-family="sans-serif" font-size="22" fill="#50505e">replyai.com.ng</text>
</svg>`;

mkdirSync('client/public', { recursive: true });
await sharp(Buffer.from(svg)).png().toFile('client/public/og-image.png');
console.log('OG image generated → client/public/og-image.png');
