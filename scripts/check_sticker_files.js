const fs = require('fs');
const path = require('path');

const stickers = [
  'role-owner',
  'role-manager',
  'role-editor',
  'role-contributor',
  'role-viewer',
  'trophy-gold',
  'trophy-silver',
  'trophy-bronze',
  'award-ribbon',
  'brass-keyring',
  'guarded-shield',
  'safe-zone-guide',
  'sticky-pushpin',
  'needs-revision-stamp',
  'ws-cafe',
  'ws-creator',
  'ws-software',
  'ws-brand'
];

for (const name of stickers) {
  const p = path.join('public', 'icons', 'stickers', `${name}.png`);
  if (fs.existsSync(p)) {
    console.log(`${name}.png exists (${fs.statSync(p).size} bytes)`);
  } else {
    console.log(`${name}.png MISSING`);
  }
}
