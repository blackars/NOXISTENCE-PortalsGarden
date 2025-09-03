import { readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const experiencesDir = join(rootDir, 'experiences');

// Common path replacements
const pathReplacements = [
  // Update Three.js imports
  {
    pattern: /from ['"]three['"]/g,
    replacement: 'from "/node_modules/three/build/three.module.js"',
  },
  // Update GLTFLoader imports
  {
    pattern: /from ['"]three\/examples\/js(m)?\/loaders\/GLTFLoader\.js['"]/g,
    replacement: 'from "/assets/js/loaders/GLTFLoader.js"',
  },
  // Update font paths
  {
    pattern: /url\(['"]\.\.\/\.\.\/public\/fonts\/([^'"\s]+\.(?:woff2?|ttf|otf))['"]\)/g,
    replacement: 'url("/$1")',
  },
  // Update asset paths
  {
    pattern: /(['"])\.\.\/\.\.\/public\/(assets\/[^'"\s]+)/g,
    replacement: '$1/$2',
  },
  // Update hand.png path
  {
    pattern: /url\(['"]\.\.\/\.\.\/public\/hand\.png['"]\)/g,
    replacement: 'url("/hand.png")',
  },
];

async function updateFile(filePath) {
  try {
    let content = await readFile(filePath, 'utf-8');
    let updated = false;

    // Apply all replacements
    for (const { pattern, replacement } of pathReplacements) {
      const newContent = content.replace(pattern, replacement);
      if (newContent !== content) {
        updated = true;
        content = newContent;
      }
    }

    // If any changes were made, write the file back
    if (updated) {
      await writeFile(filePath, content, 'utf-8');
      console.log(`Updated paths in ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

async function main() {
  try {
    // Find all HTML and JS files in experiences directory
    const files = await glob('**/*.{html,js}', { cwd: experiencesDir, absolute: true });
    
    console.log(`Found ${files.length} files to process`);
    
    // Process each file
    for (const file of files) {
      await updateFile(file);
    }
    
    console.log('Finished updating paths in all experience files');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
