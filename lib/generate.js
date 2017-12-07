var _ = require('lodash');
var fs = require('fs');
var path = require('path');

var archiver = require('./archiver');
var createServiceFile = require('./service');
var createSysConfigFile = require('./sysconfig');
var createSpecFile = require('./spec');
var files = require('./files');


function generateSysconfigFile(root, pkg) {
  var sysConfigFileContents = createSysConfigFile(pkg);
  var sysConfigFilePath = files.sysConfigFile(root, pkg);

  fs.writeFileSync(sysConfigFilePath, sysConfigFileContents);

  return sysConfigFilePath;
}

function generateServiceFile(root, pkg) {
  var serviceFileContents = createServiceFile(pkg);
  var serviceFilePath = files.serviceFile(root, pkg);

  fs.writeFileSync(serviceFilePath, serviceFileContents);

  return serviceFilePath;
}

function generateSpecFile(root, pkg, release) {
  var specFileContents = createSpecFile(pkg, release);
  var specFilePath = files.specFile(root, pkg);

  fs.writeFileSync(specFilePath, specFileContents);

  return specFilePath;
}

function addCustomFieldsToPackage(pkg, customName) {
  if (customName) {
    return _.extend({}, pkg, { name: customName });
  }

  return pkg;
}

function relativeToRoot(root, files) {
  return files.map(function (file) {
    return path.relative(root, file);
  });
}

function getArchiveWhitelist(pkg) {
  return _.pick(pkg, ['main', 'files']);
}

module.exports = function (root, pkg, release, customName, cb) {
  var customPackage = addCustomFieldsToPackage(pkg, customName);
  var specsDirectory = files.specsDirectory(root);
  var sourcesDirectory = files.sourcesDirectory(root);
  var sysConfigDirectory = files.sysConfigDirectory(root);
  var sourcesArchive = files.sourcesArchive(root, customPackage);

  fs.mkdirSync(specsDirectory);
  fs.mkdirSync(sourcesDirectory);
  fs.mkdirSync(sysConfigDirectory);
  var serviceFile = generateServiceFile(root, customPackage);
  var sysConfigFile = generateSysconfigFile(root, customPackage);
  var specFile = generateSpecFile(specsDirectory, customPackage, release);
  var archiveWhitelist = getArchiveWhitelist(pkg);

  archiver.compress(root, sourcesArchive, archiveWhitelist, function (err) {
    if (err) {
      return cb(err);
    }

    cb(null, relativeToRoot(root, [
      specFile,
      sourcesArchive,
      serviceFile,
      sysConfigFile
    ]));
  });
};
