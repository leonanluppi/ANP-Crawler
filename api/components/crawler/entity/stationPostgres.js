'use strict';

let StationPostgres = (sequelize, DataTypes) => {
  return sequelize.define('station', {
    name     : DataTypes.STRING,
    address  : DataTypes.STRING,
    area     : DataTypes.STRING,
    flag     : DataTypes.STRING,
    type     : DataTypes.STRING,
    date     : DataTypes.DATE,
    sellPrice: DataTypes.DOUBLE,
    buyPrice : DataTypes.DOUBLE,
    saleMode : DataTypes.DOUBLE,
    provider : DataTypes.DOUBLE
  });
};

module.exports = StationPostgres;

