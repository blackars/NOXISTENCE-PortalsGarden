import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdir, copyFile, readdir, stat, readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const distDir = join(rootDir, 'dist');

// --- Helpers ---
async function ensureDir(path) {
  if (!existsSync(path)) {
    await mkdir(path, { recursive: true });
  }
}

async function copyFileWithDirs(src, dest) {
  await ensureDir(dirname(dest));
  await copyFile(src, dest);
  console.log(`✔ Copied: ${src.replace(rootDir, '')} -> ${dest.replace(rootDir, '')}`);
}

async function processAndCopyJsFile(src, dest) {
  let content = await readFile(src, 'utf-8');
  // Reemplaza import de 'three'
  content = content.replace(/from 'three'/g, "from '/assets/js/three.module.js'");
  // Reemplaza imports relativos dentro de three/examples/jsm
  content = content.replace(/from '\.\.\/(.*?)'/g, "from '/assets/js/$1'");
  await ensureDir(dirname(dest));
  await writeFile(dest, content, 'utf-8');
  console.log(`✔ Processed JS: ${src.replace(rootDir, '')} -> ${dest.replace(rootDir, '')}`);
}

// --- Copia directorios generales ---
async function copyDir(src, dest) {
  await ensureDir(dest);
  const entries = await readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await copyFileWithDirs(srcPath, destPath);
    }
  }
}

// --- Proceso principal ---
async function copyFiles() {
  await ensureDir(distDir);
  await ensureDir(join(distDir, 'assets/js'));

  // Copiar three.module.js base
  await copyFileWithDirs(
    join(rootDir, 'node_modules/three/build/three.module.js'),
    join(distDir, 'assets/js/three.module.js')
  );

  // Copiar todo lo de three/examples/jsm (loaders, controls, utils, postprocessing, etc.)
  const jsmDir = join(rootDir, 'node_modules/three/examples/jsm');
  async function copyJsm(src, dest) {
    const entries = await readdir(src, { withFileTypes: true });
    for (const entry of entries) {
      const srcPath = join(src, entry.name);
      const destPath = join(dest, entry.name);
      if (entry.isDirectory()) {
        await copyJsm(srcPath, destPath);
      } else if (srcPath.endsWith('.js')) {
        await processAndCopyJsFile(srcPath, destPath);
      }
    }
  }
  await copyJsm(jsmDir, join(distDir, 'assets/js'));

  // Copiar tus carpetas personalizadas
  const customDirs = ['experiences', 'public', 'fonts', 'sounds'];
  for (const dir of customDirs) {
    const srcPath = join(rootDir, dir);
    if (existsSync(srcPath)) {
      const destPath = join(distDir, dir);
      console.log(`📂 Copying ${dir}...`);
      await copyDir(srcPath, destPath);
    }
  }

  console.log('\n✅ Copy process finished!');
}

copyFiles().catch(err => {
  console.error('❌ Error in copy process:', err);
  process.exit(1);
});
