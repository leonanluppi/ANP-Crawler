'use strict';

let StatisticPostgres = (sequelize, DataTypes) => {
  return sequelize.define('statistic', {
    type               : DataTypes.STRING,
    cpAveragePrice     : DataTypes.DOUBLE,
    cpstandardDeviation: DataTypes.DOUBLE,
    cpminPrice         : DataTypes.DOUBLE,
    cpmaxPrice         : DataTypes.DOUBLE,
    cpmaxPrice         : DataTypes.DOUBLE,
    dpAveragePrice     : DataTypes.DOUBLE,
    dpstandardDeviation: DataTypes.DOUBLE,
    dpminPrice         : DataTypes.DOUBLE,
    dpmaxPrice         : DataTypes.DOUBLE,
    dpmaxPrice         : DataTypes.DOUBLE
  });
};

module.exports = StatisticPostgres;

