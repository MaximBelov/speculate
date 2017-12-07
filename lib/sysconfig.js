var hogan = require('hogan.js');
var fs = require('fs');
var path = require('path');
var getSysconfigProperties = require('./sysconfigProperties');

var templateFile = fs.readFileSync(path.resolve(__dirname, '../templates/sysconfig.mustache'), 'utf-8');
var template = hogan.compile(templateFile);

module.exports = function (pkg) {
  var sysconfigProperties = getSysconfigProperties(pkg);

  return template.render(sysconfigProperties);
};
