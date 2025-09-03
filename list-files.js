const fs = require('fs');
const path = require('path');

function listFiles(dir, filelist = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filepath = path.join(dir, file);
    const stat = fs.statSync(filepath);
    
    if (stat.isDirectory()) {
      listFiles(filepath, filelist);
    } else {
      filelist.push(filepath);
    }
  });
  
  return filelist;
}

const allFiles = listFiles('.');
console.log('All files in project:');
console.log(allFiles.join('\n'));
