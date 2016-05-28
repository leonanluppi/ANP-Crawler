'use strict';

let Express       = require('express');
let Config        = require('./configs');
let App           = Express();
let HttpServer    = require('http').createServer(App);
let ExpressConfig = require('./configs/express')(App);
let Colog         = require('colog');

let Bootstrap = (() => {

  HttpServer.listen(Config.ExpressServer.port, Config.ExpressServer.address, () => {
    Colog.success(`SUCCESS: Express server has been started listening at port => ${Config.ExpressServer.port} and address => ${Config.ExpressServer.address} in ENV => ${Config.EnvName}`);
  });

  HttpServer.on('error', () => {
    Colog.error(`ERROR: Ops! Something went wrong when starting Express server at port => ${Config.ExpressServer.port} and address => ${Config.ExpressServer.address} in ENV => ${Config.EnvName}`);
  });

  return App;
})();

module.exports = Bootstrap;