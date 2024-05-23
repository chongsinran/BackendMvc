const fs = require('fs');
const path = require('path');

function drawDirectoryStructure(dir, indent = '') {
  const files = fs.readdirSync(dir);

  files.forEach((file, index) => {
    const filePath = path.join(dir, file);
    const isLast = index === files.length - 1;
    const line = isLast ? '└── ' : '├── ';

    // Skip node_modules directory
    if (file === 'node_modules') {
      return;
    }

    console.log(indent + line + file);

    if (fs.statSync(filePath).isDirectory()) {
      const newIndent = indent + (isLast ? '    ' : '│   ');
      drawDirectoryStructure(filePath, newIndent);
    }
  });
}

const startPath = process.argv[2] || '.';
console.log(startPath);
drawDirectoryStructure(startPath);
