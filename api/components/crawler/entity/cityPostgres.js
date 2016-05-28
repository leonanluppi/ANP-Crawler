'use strict';

let CityPostgres = (sequelize, DataTypes) => {
  return sequelize.define('city', {
    name: DataTypes.STRING
  });
};

module.exports = CityPostgres;

