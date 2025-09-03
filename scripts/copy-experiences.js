import { cp, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const srcDir = join(rootDir, 'experiences');
const destDir = join(rootDir, 'dist', 'experiences');

async function copyExperiences() {
  try {
    // Create destination directory if it doesn't exist
    if (!existsSync(destDir)) {
      await mkdir(destDir, { recursive: true });
    }
    
    // Copy all files and directories
    await cp(srcDir, destDir, { 
      recursive: true, 
      force: true,
      errorOnExist: false,
      preserveTimestamps: true
    });
    
    console.log('Successfully copied experiences directory');
  } catch (error) {
    console.error('Error copying experiences directory:', error);
    process.exit(1);
  }
}

copyExperiences();
