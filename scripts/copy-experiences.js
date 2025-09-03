import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { copyFile, mkdir, readdir, stat, readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Helper function to copy a file with directory creation
async function copyFileWithDirs(src, dest) {
  try {
    await mkdir(dirname(dest), { recursive: true });
    await copyFile(src, dest);
    console.log(`Copied: ${src.replace(rootDir, '')} -> ${dest.replace(rootDir, '')}`);
  } catch (err) {
    console.error(`Error copying ${src} to ${dest}:`, err);
    throw err;
  }
}

// Define source and destination directories
const srcDirs = [
  { 
    from: 'experiences', 
    to: 'experiences',
    options: { recursive: true, force: true, preserveTimestamps: true }
  },
  { 
    from: 'public', 
    to: '',
    options: { recursive: true, force: true, preserveTimestamps: true }
  },
  // Copy Three.js and its dependencies
  {
    from: 'node_modules/three/build/three.module.js',
    to: 'assets/js/three.module.js'
  },
  {
    from: 'node_modules/three/examples/jsm/loaders/GLTFLoader.js',
    to: 'assets/js/GLTFLoader.js'
  },
  {
    from: 'node_modules/three/examples/jsm/controls/OrbitControls.js',
    to: 'assets/js/OrbitControls.js'
  },
  // Copy public assets
  {
    from: 'public/assets',
    to: 'assets'
  },
  // Copy hand.png to root
  {
    from: 'public/hand.png',
    to: 'hand.png'
  },
  // Copy fonts
  {
    from: 'public/fonts',
    to: 'fonts'
  }
];

async function copyDir(src, dest) {
  try {
    await mkdir(dest, { recursive: true });
    const entries = await readdir(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = join(src, entry.name);
      const destPath = join(dest, entry.name);

      // Skip node_modules and other unnecessary directories
      if (entry.isDirectory() && (entry.name === 'node_modules' || entry.name === '.git')) {
        console.log(`Skipping directory: ${srcPath}`);
        continue;
      }

      if (entry.isDirectory()) {
        console.log(`Entering directory: ${srcPath}`);
        await copyDir(srcPath, destPath);
      } else {
        // Skip source maps and other unnecessary files
        if (srcPath.endsWith('.map') || srcPath.includes('__tests__')) {
          console.log(`Skipping file: ${srcPath}`);
          continue;
        }
        
        try {
          await copyFileWithDirs(srcPath, destPath);
        } catch (err) {
          console.error(`Error copying ${srcPath}:`, err);
          throw err;
        }
      }
    }
  } catch (error) {
    console.error(`Error in copyDir for ${src}:`, error);
    throw error;
  }
}

async function copyFiles() {
  try {
    // Create dist directory if it doesn't exist
    const distDir = join(rootDir, 'dist');
    if (!existsSync(distDir)) {
      await mkdir(distDir, { recursive: true });
    }
    
    // Create necessary directories
    await mkdir(join(distDir, 'assets', 'js'), { recursive: true });
    await mkdir(join(distDir, 'assets', 'models'), { recursive: true });
    await mkdir(join(distDir, 'fonts'), { recursive: true });
    await mkdir(join(distDir, 'sounds'), { recursive: true });

    // Copy each source item
    for (const item of srcDirs) {
      const srcPath = join(rootDir, item.from);
      const destPath = join(distDir, item.to);
      
      console.log(`\nProcessing: ${item.from} -> ${item.to}`);
      console.log(`Source: ${srcPath}`);
      console.log(`Destination: ${destPath}`);
      
      try {
        // Check if source exists
        if (!existsSync(srcPath)) {
          console.warn(`Source path does not exist: ${srcPath}`);
          continue;
        }
        
        const stats = await stat(srcPath);
        
        if (stats.isDirectory()) {
          console.log(`Copying directory: ${srcPath} -> ${destPath}`);
          await copyDir(srcPath, destPath);
        } else {
          console.log(`Copying file: ${srcPath} -> ${destPath}`);
          await copyFileWithDirs(srcPath, destPath);
        }
      } catch (error) {
        console.error(`Error processing ${item.from}:`, error);
        throw error;
      }
    }
    
    console.log('\nSuccessfully copied all static files');
  } catch (error) {
    console.error('Error in copy process:', error);
    process.exit(1);
  }
}

copyFiles();
