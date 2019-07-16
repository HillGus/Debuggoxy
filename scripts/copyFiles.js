const fs = require('fs');

function ensureDir(dirPath) {

  if (!fs.existsSync(dirPath)) {

    const dirSegments = dirPath.split('/');
    let dirWalked = '';
    dirSegments.forEach(segment => {

      if (segment === '' || segment === '.') {
        dirWalked += segment;
        return;
      }

      dirWalked += '/' + segment;
      fs.existsSync(dirWalked) || fs.mkdirSync(dirWalked);
    });
  }
}

function copyFiles(srcPath, distPath) {

  const dirStats = fs.lstatSync(srcPath);

  if (!dirStats.isDirectory())
    return;

  while(srcPath.endsWith('/'))
    srcPath = srcPath.substring(0, srcPath.length - 1);

  const filesPaths = fs.readdirSync(srcPath);
  if (filesPaths) {

    filesPaths.forEach(filePath => {

      const inputFilePath = srcPath + '/' + filePath;
      const outputFilePath = distPath + '/' + filePath;
      const inputFileStats = fs.lstatSync(inputFilePath);

      if (inputFileStats.isFile()) {

        if (!inputFilePath.endsWith('.ts')) {

          ensureDir(distPath);
          fs.writeFileSync(outputFilePath, '');
          fs.createReadStream(inputFilePath).pipe(fs.createWriteStream(outputFilePath));
            
        }
      } else if (inputFileStats.isDirectory()) {

        copyFiles(inputFilePath, outputFilePath);
      }
    });
  }
}

copyFiles('./src', './dist');