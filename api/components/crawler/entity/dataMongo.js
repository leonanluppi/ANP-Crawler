'use strict';

let Mongoose = require('mongoose');
let Schema   = Mongoose.Schema;

let WeekDataMongo = new Schema({
  any: {}
},{ "strict": false });

module.exports = Mongoose.model('WeekData', WeekDataMongo, 'WeekData');
