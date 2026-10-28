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

const matches = [];
for (const file of walk('src')) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((l, i) => {
    if (l.includes('stickerName=') || l.includes('<Sticker') || l.includes('Sticker name')) {
      matches.push(`${file}:${i+1}: ${l.trim()}`);
    }
  });
}

console.log(`Found ${matches.length} matches:`);
matches.forEach(m => console.log(m));
