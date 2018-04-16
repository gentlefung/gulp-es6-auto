var check = require('check-types');
var install = require('npm-utils').install;
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var exec = require('child_process').exec;

function changed(packageName) {
  check.verify.string(packageName, 'missing package name string');

  console.log('what has changed in', packageName);
  // todo: check / strip version

  var installFolder = path.join(process.cwd(), 'temp');
  mkdirp.sync(installFolder);

  var promise = install({
    name: packageName,
    prefix: 'temp'
  });
  promise.then(function () {
    // console.log('installed', packageName);
    var packageFolder = path.join(installFolder, 'lib/node_modules',
      packageName);
    // console.log('should have been installed in', packageFolder);
    findChanges(packageName, packageFolder);

    exec('rm -rf ' + installFolder, function (err, stdout, stderr) {
      if (err) {
        console.error(err);
      } else {
        console.log(stdout, stderr);
        console.log('done removing temp folder');
      }
    });
  });
}

function findChanges(packageName, packageFolder) {
  check.verify.string(packageName, 'expected package name');
  check.verify.string(packageFolder, 'expected package folder');

  console.assert(fs.existsSync(packageFolder), packageFolder + ' not found');
  console.assert(fs.statSync(packageFolder).isDirectory(),
    packageFolder + ' is not a folder');

  var candidateFiles = ['History.md',
  'History',
  'Changes.md',
  'Changes',
  'README.md'];
  var found = candidateFiles.some(function (name) {
    var filename = path.join(packageFolder, name);
    if (fs.existsSync(filename) &&
      fs.statSync(filename).isFile()) {
      printChanges(filename);
      return true;
    }
  });
  if (!found) {
    console.error('Could not find changes list');
  }
}

function printChanges(filename) {
  console.log(fs.readFileSync(filename, 'utf-8'));
}

module.exports = changed;
