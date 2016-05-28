'use strict';

let ProductionEnv = (() => {
  return {
    EnvName       : 'production',
    ExpressServer : {
      port        : 3000,
      address     : 'MACHINE_IP'
    },
    MongoServer   : {
      url         : '',
      port        : '',
      username    : '',
      password    : '',
      options     : {}
    },
    PostgresServer: {
      url         : '',
      port        : '',
      username    : '',
      password    : '',
      options     : {}
    }
  };
})();

module.exports = ProductionEnv;
