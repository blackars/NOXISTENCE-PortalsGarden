const fs = require('fs');
const path = require('path');

// List of paths to check
const pathsToCheck = [
  'index.html',
  'experiences/anothearth/anothearth.html',
  'experiences/game-life/gameoflife.html',
  'experiences/maxkodiaplanet/maxkodiaplanet.html',
  'experiences/clean-squaredplace/cleansquaredplace.html',
  'experiences/space-words/spacewords.html',
  'experiences/n-bases/nbases.html',
  'experiences/human-thinker/humanthinker.html',
  'experiences/deepspace/deepspace.html',
  'experiences/thinker/thinker.html'
];

console.log('Checking file paths:');
console.log('===================');

let allExist = true;
pathsToCheck.forEach(filePath => {
  const fullPath = path.resolve(filePath);
  const exists = fs.existsSync(fullPath);
  console.log(`${exists ? '✓' : '✗'} ${filePath}`);
  if (!exists) {
    console.log(`   Path does not exist: ${fullPath}`);
    allExist = false;
  }
});

if (allExist) {
  console.log('\n✓ All paths exist!');
} else {
  console.log('\n✗ Some paths are missing!');
}
