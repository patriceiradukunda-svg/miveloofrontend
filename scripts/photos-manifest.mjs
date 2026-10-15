// Lists which photos exist in public/images/photos so pages can choose photo vs illustration at build time.
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
const dir = 'public/images/photos';
mkdirSync('src/generated', { recursive: true });
const files = existsSync(dir) ? readdirSync(dir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)) : [];
writeFileSync('src/generated/photos.json', JSON.stringify(files, null, 1) + '\n');
console.log(`photos manifest: ${files.length} file(s)`);
