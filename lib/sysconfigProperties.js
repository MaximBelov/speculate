var _ = require('lodash');

function getEnvironment(pkg) {
  var environment = _.get(pkg, 'spec.environment', {});
  return Object.keys(environment).map(function(key) {
    return { key: key, value: environment[key]};
  });
}

module.exports = function (pkg) {
  return {
    environment: getEnvironment(pkg),
  };
};
