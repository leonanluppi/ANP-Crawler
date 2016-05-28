'use strict';

let Config            = require('../');
let Colog             = require('colog');
let FileStream        = require("fs");
let Path              = require("path");
let Sequelize         = require("sequelize");

let PostgresBootstrap = (() => {

  let db                = {};
  const OPTIONS         = {
    componentsDir: Path.join(__dirname, '/../../components/')
  };
  let SequelizeInstance = new Sequelize(Config.PostgresServer.database, Config.PostgresServer.username, Config.PostgresServer.password, Config.PostgresServer);

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
                          if (file.indexOf('Postgres') != -1) {
                            let model = SequelizeInstance.import(Path.join(currentDir.concat(file)));
                            return db[model.name] = model;
                          }
                        });
            });

  //Auto generate relationships in DB
  Object.keys(db)
        .forEach((modelName) => {
    if (db[modelName].hasOwnProperty("associate")) {
      return db[modelName].associate(db);
    }
  });

  //Auto generate table in DB
  for (let modelName in db) {
    ((model) => {
      SequelizeInstance.sync({
        logging: false
      }).then(() => {
        Colog.success(`SUCCESS: Load entity => ${model}`);
        return model;
      }, (err) => {
        Colog.warning(`WARNING: Humm, I'm checking this entity => ${model}.I can't mapping everything but appears ok`);
      });
    })(db[modelName]);
  }

  db.SequelizeInstance = SequelizeInstance;
  db.Sequelize = Sequelize;

  return db;
})();

module.exports = PostgresBootstrap;