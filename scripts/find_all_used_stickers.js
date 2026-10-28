const fs = require('fs');
const path = require('path');

function walk(dir) {
  let res = [];
  for (const f of fs.readdirSync(dir)) {
    if (f === 'node_modules' || f === '.next' || f === '.git') continue;
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) res = res.concat(walk(p));
    else if (f.endsWith('.tsx') || f.endsWith('.ts')) res.push(p);
  }
  return res;
}

const stickerRegex = /<Sticker[^>]+name=["']([^"']+)["']/g;
const usedStickers = new Map();

for (const file of walk('src')) {
  const content = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = stickerRegex.exec(content)) !== null) {
    const name = match[1];
    if (!usedStickers.has(name)) usedStickers.set(name, []);
    usedStickers.get(name).push(file);
  }
}

console.log(`Found ${usedStickers.size} distinct sticker names used in JSX:`);
for (const [name, files] of Array.from(usedStickers.entries()).sort()) {
  console.log(`- ${name} (used in ${files.length} places)`);
}
