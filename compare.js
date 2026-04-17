const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function getFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === '.git') continue;
    const stat = fs.statSync(path.join(dir, file));
    if (stat.isDirectory()) {
      getFiles(path.join(dir, file), fileList);
    } else {
      fileList.push(path.join(dir, file));
    }
  }
  return fileList;
}

function getMD5(filePath) {
  return crypto.createHash('md5').update(fs.readFileSync(filePath)).digest('hex');
}

function compareDirs(dirA, dirB) {
  const filesA = getFiles(dirA).map(f => path.relative(dirA, f));
  const filesB = getFiles(dirB).map(f => path.relative(dirB, f));

  const setA = new Set(filesA);
  const setB = new Set(filesB);

  const uniqueA = filesA.filter(f => !setB.has(f));
  const uniqueB = filesB.filter(f => !setA.has(f));

  const common = filesA.filter(f => setB.has(f));
  const differing = common.filter(f => getMD5(path.join(dirA, f)) !== getMD5(path.join(dirB, f)));

  console.log(`\n--- Comparing ${dirA} vs ${dirB} ---`);
  console.log(`Unique in ${dirA}:`, uniqueA);
  console.log(`Unique in ${dirB}:`, uniqueB);
  console.log(`Differing files:`, differing);
}

compareDirs('backend', 'LeadOS/backend');
compareDirs('frontend', 'LeadOS/frontend');
