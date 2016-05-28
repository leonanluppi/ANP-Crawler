'use strict';

let DevelopmentEnv = (() => {
  return {
    EnvName       : 'development',
    ExpressServer : {
      port        : 3000,
      address     : '127.0.0.1'
    },
    MongoServer   : {
      url         : 'mongodb://localhost/softruck',
      port        : '',
      username    : '',
      password    : '',
      options     : {}
    },
    PostgresServer: {
      username    : 'Leonan-Mac',
      password    : '',
      database    : 'softruck',
      host        : '127.0.0.1',
      port        : '5432',
      dialect     : 'postgres',
    }
  };
})();

module.exports = DevelopmentEnv;
