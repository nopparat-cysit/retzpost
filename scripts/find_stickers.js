const fs = require('fs');
const path = require('path');
function walk(dir) {
  let results = [];
  for (const file of fs.readdirSync(dir)) {
    if (file === 'node_modules' || file === '.next' || file === '.git') continue;
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) results = results.concat(walk(full));
    else if (file.endsWith('.ts') || file.endsWith('.tsx')) results.push(full);
  }
  return results;
}
const files = walk('src');
const terms = ['camera-reel', 'broadsheet-newspaper', 'calendar-deadline', 'vault-keyhole', 'award-star-badge', 'bullseye', 'approved-seal'];
for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  terms.forEach(term => {
    if (content.includes(term)) {
      console.log(`${f} contains ${term}`);
    }
  });
}
