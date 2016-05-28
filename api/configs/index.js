'use strict';

let BootstrapConfig = (() => {
  let ENV = process.env.NODE_ENV || 'development';
  let Dir = `./enviroments/${ENV}.js`;

  return require(Dir);
})();

module.exports = BootstrapConfig;