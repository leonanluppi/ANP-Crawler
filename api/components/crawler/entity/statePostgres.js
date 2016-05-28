'use strict';

let StatePostgres = (sequelize, DataTypes) => {
  return sequelize.define('state', {
    name    : DataTypes.STRING,
    dateFrom: DataTypes.STRING,
    dateTo  : DataTypes.STRING
  });
};

module.exports = StatePostgres;

