'use strict';

let Express = require('express');
let Router  = Express.Router();

let RouteBootstrap = (() => {

  Router.get('/:state',          require('./src/findByHistoryOrCurrentWeek'));
  Router.post('/stations/:city', require('./src/findStationsByCity'));
  Router.post('/:state',         require('./src/findByCrawler'));

  return Router;
})();

module.exports = RouteBootstrap;
