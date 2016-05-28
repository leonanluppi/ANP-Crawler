'use strict';

let Logger     = require('morgan');
let BodyParser = require('body-parser');
let Express    = require('express');
let Path       = require('path');
let FileStream = require("fs");
let EJS        = require('ejs');
let Colog      = require('colog');

let ExpressBootstrap = (expressApp) => {

  let ENV = process.env.NODE_ENV || 'development';

  expressApp.engine('ejs', EJS.renderFile);
  expressApp.set('view engine', 'ejs');
  expressApp.use(Logger('dev'));
  expressApp.use(BodyParser.urlencoded({ extended: true }));
  expressApp.use(BodyParser.json());
  expressApp.use(Express.static(Path.join(__dirname, 'public')));
  expressApp.use((req, res, doNext) => {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    doNext();
  });

  let setUpDatabases = (() => {
    require('../databases/mongo');
    require('../databases/postgres');
  })();

  let setUpComponents = (() => {
    let componentsDir = Path.join(__dirname, '../../components');

    FileStream.readdirSync(componentsDir)
              .forEach((file) => {
                if(file === '.DS_Store') {
                  return;
                }

                let currentDir = Path.join(componentsDir, file);

                Colog.success(`SUCCESS: Load Component => ${file}`);
                return expressApp.use(require(currentDir));
              });
  })();
};

module.exports = ExpressBootstrap;