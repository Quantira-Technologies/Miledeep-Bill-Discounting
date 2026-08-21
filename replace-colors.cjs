const fs = require('fs');
const path = require('path');

const directory = path.join(__dirname, 'src');

const replacements = [
  { regex: /'#000000'/g, replacement: "'var(--steampunk-gold)'" },
  { regex: /"#000000"/g, replacement: "'var(--steampunk-gold)'" },
  { regex: /'#09090b'/g, replacement: "'var(--foreground)'" },
  { regex: /"#09090b"/g, replacement: "'var(--foreground)'" },
  { regex: /'#0f172a'/g, replacement: "'var(--foreground)'" },
  { regex: /"#0f172a"/g, replacement: "'var(--foreground)'" },
  { regex: /'#fafafa'/g, replacement: "'var(--background)'" },
  { regex: /"#fafafa"/g, replacement: "'var(--background)'" },
  { regex: /'#f8fafc'/g, replacement: "'var(--background)'" },
  { regex: /"#f8fafc"/g, replacement: "'var(--background)'" },
  { regex: /'#1e293b'/g, replacement: "'var(--gold-shade-80)'" },
  { regex: /"#1e293b"/g, replacement: "'var(--gold-shade-80)'" },
  { regex: /'#334155'/g, replacement: "'var(--gold-shade-70)'" },
  { regex: /"#334155"/g, replacement: "'var(--gold-shade-70)'" }
];

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      for (const r of replacements) {
        content = content.replace(r.regex, r.replacement);
      }
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

walkDir(directory);
console.log('Color replacement complete.');
