const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactDir = 'C:\\Users\\Nopparat\\.gemini\\antigravity\\brain\\3532dc62-f4fb-42a7-b4e0-824ef0894924';
const tmpUserDir = path.join(process.env.TEMP || 'C:\\Temp', 'chrome_shot_profile');

const targets = [
  { name: 'preview_dashboard.png', url: 'http://localhost:3000/' },
  { name: 'preview_content.png', url: 'http://localhost:3000/content' },
  { name: 'preview_calendar.png', url: 'http://localhost:3000/calendar' },
  { name: 'preview_accounts.png', url: 'http://localhost:3000/accounts' },
  { name: 'preview_create.png', url: 'http://localhost:3000/create' },
];

for (const t of targets) {
  const destPath = path.join(artifactDir, t.name);
  console.log(`Capturing ${t.url} -> ${destPath}...`);
  try {
    const cmd = `"${chromePath}" --headless=new --disable-gpu --window-size=1280,900 --user-data-dir="${tmpUserDir}" --screenshot="${destPath}" "${t.url}"`;
    execSync(cmd, { stdio: 'ignore' });
    if (fs.existsSync(destPath)) {
      console.log(`✓ Saved ${t.name} (${fs.statSync(destPath).size} bytes)`);
    } else {
      console.log(`✗ Failed to save ${t.name}`);
    }
  } catch (err) {
    console.error(`Error capturing ${t.name}:`, err.message);
  }
}
