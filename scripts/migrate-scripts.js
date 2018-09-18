const fs = require('fs');
const { execSync } = require('child_process');
const _path = require('path');

const SCOPE = '@scion-scxml';
const pkgNameRe = /^(@jbeard\/)?((((scion)|(scxml))-(scxml-)?)?(.*))$/;

const packagePaths = require('../lerna.json').packages;

//read all the packages
const bundles = packagePaths.map( pkgPath => {
  const path = pkgPath + '/package.json';
  return { path, pkgDir: pkgPath, pkg : require('../' + path) };
})

//get names to map
const nameMap = {};
bundles.forEach( bundle => nameMap[bundle.pkg.name] = scopeName(bundle.pkg.name) );
console.log('Mapping names ', nameMap );

const filesTouched = new Set();

bundles.forEach( ({path, pkgDir}) => {
  const files = findFiles(pkgDir);
  files.forEach( file => {
    if(file.indexOf(`public`) > -1 
        || file.indexOf(`/dist/`) > -1) return;
    const pathToFile = _path.join(pkgDir, file); 
    if(filesTouched.has(pathToFile)) return;    //we might encounter duplicate files, so skip them
    filesTouched.add(pathToFile);
    const contents = fs.readFileSync(pathToFile, 'utf8');
    //replace file contents
    let newContents = contents;
    bundles.forEach( ({ pkg }) => {
      const re = new RegExp(`(require\\(['"])${pkg.name}(['"]\\))`,'g');
      newContents = newContents.replace(re, `$1${nameMap[pkg.name]}$2`); 
      const re2 = new RegExp(`(import *[^ ]* *from *['"])${pkg.name}(['"])`,'g');
      newContents = newContents.replace(re2, `$1${nameMap[pkg.name]}$2`); 
      if(_path.extname(file) === '.html' || _path.extname(file) === '.svg'){
        const re3 = new RegExp(`(node_modules/)${pkg.name}`,'g');
        newContents = newContents.replace(re3, `$1${nameMap[pkg.name]}`); 
      }
    });
    if(contents !== newContents){
      console.log('writing pathToFile', pathToFile);
      fs.writeFileSync(pathToFile, newContents);  //commit the changed file
    }
  });
}); 

//commit changes
bundles.forEach( ({ pkg, path }) => {
  pkg.name = nameMap[pkg.name];
  [
    'dependencies',
    'devDependencies',
    'peerDependencies'
  ].forEach( key => {
    const dependencies = pkg[key];
    if(dependencies){
      Object.keys(dependencies).forEach( (pkgName) => {
        if(nameMap[pkgName]){
          dependencies[nameMap[pkgName]] = dependencies[pkgName];
          delete dependencies[pkgName];
        }
      })
    }
  })
  pkg['private'] = true;

  //write the file
  console.log('writing pathToFile', path)
  fs.writeFileSync(path, JSON.stringify(pkg, null, 2));
})


function scopeName(pkgName){
  const m = pkgName.match(pkgNameRe);
  
  if(pkgName.indexOf(SCOPE) > -1) return pkgName;
  if(m){
    return `${SCOPE}/${m[8]}`;
  }else{
    return `${SCOPE}/${pkgName}`;
  }
}

function findFiles(dir){
  return execSync(`cd ${dir} && find . -name 'index.html' -not -path './*node_modules/*' -o -name '*.js' -not -path './*node_modules/*' -o -name '*.jsx' -not -path './*node_modules/*' -o -name '*.ts' -not -path './*node_modules/*' -o -name '*.tsx' -not -path './*node_modules/*' -o -name '*.svg' -not -path './*node_modules/*'`).toString().trim().split('\n');
}
