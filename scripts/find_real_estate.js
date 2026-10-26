const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (file === 'node_modules' || file === '.next' || file === '.git') continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.json') || file.endsWith('.js')) {
      results.push(fullPath);
    }
  }
  return results;
}

const pattern = /(The Rich|Capital One|capitalone|Prime Sky|Penthouse|คอนโด|อสังหา|เว็บโครงการ|เว็บไซต์โครงการ|เลือกโครงการ|ชื่อโครงการ)/i;
const files = walk('src');
const matches = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (pattern.test(line)) {
      matches.push(`${file}:${idx + 1}: ${line.trim()}`);
    }
  });
}

console.log(`Found ${matches.length} matches:`);
matches.forEach(m => console.log(m));
