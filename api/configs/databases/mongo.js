'use strict';

let Mongoose   = require('mongoose');
let Config     = require('../');
let Colog      = require('colog');
let FileStream = require("fs");
let Path       = require("path");

let MongoBootstrap = (() => {
  let MongoDB   = Mongoose.connect(Config.MongoServer.url).connection;
  const OPTIONS = {
    componentsDir: Path.join(__dirname, '/../../components/')
  };

  //Get all models
  FileStream.readdirSync(OPTIONS.componentsDir)
            .filter((dir) => {
              return (dir.indexOf(".") !== 0) && (dir !== "index.js") && (dir !== "shared");
            })
            .forEach((dir) => {
              let currentDir = OPTIONS.componentsDir.concat(dir)
                                                    .concat('/entity/');
              FileStream.readdirSync(currentDir)
                        .forEach((file) => {
                          if (file.indexOf('Mongo') != -1) {
                            Colog.success(`SUCCESS: Load entity => ${file}`);
                            return require(Path.join(currentDir.concat(file)));
                          }
                        });
            });

  MongoDB.on('error', () => {
    Colog.error('ERROR: Ops! Something went wrong when starting MongoDB');
  });
  MongoDB.once('connected', () => {
    Colog.success('SUCCESS: MongoDB has been started successful');
  });

  return MongoDB;

})();