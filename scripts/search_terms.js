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
for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  if (content.toLowerCase().includes('the rich') || content.toLowerCase().includes('sathorn') || content.toLowerCase().includes('rama9')) {
    console.log(f);
    content.split('\n').forEach((l, i) => {
      if (l.toLowerCase().includes('the rich') || l.toLowerCase().includes('sathorn') || l.toLowerCase().includes('rama9')) {
        console.log('  ' + (i+1) + ': ' + l.trim());
      }
    });
  }
}
