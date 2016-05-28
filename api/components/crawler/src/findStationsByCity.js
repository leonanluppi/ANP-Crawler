'use strict';

let ComponentAction  = (() => {
  let Async          = require('async');
  let Moment         = require('moment');
  let Colog          = require('colog');

  let CheerioAdapter = require('./adapters/cheerioAdapter');
  let RequestAdapter = require('./adapters/requestAdapter');
  let CrawlerMocks   = require('./mapping/crawlerMocks');
  let CrawlerMap     = require('./mapping/crawlerSiteMapping');

  let Mongoose       = require('mongoose');
  let WeekDataMongo  = Mongoose.model('WeekData');

  let validateRequestParams = (body) => {
    if(!body.city.length) {
      Colog.error(`ERROR: Ops!! Something happens. I can not validate your request completely, please look up body request or params request`);

      return false;
    }

    return true;
  };

  let validateRequestBody = (body) => {
    if((body && !Object.keys(body).length) && !body.estado.length || !body.dateFrom.length || !body.dateTo.length) {
      Colog.error(`ERROR: Ops!! Something happens. I can not validate your request completely, please look up body request or params request`);

      return false;
    }

    return true;
  };

  return function middleware(req, res, next) {

    if (!validateRequestParams(req.params) || !validateRequestBody(req.body)) {
      return res.status(400)
                .json({
                  status : false,
                  message: 'You must need complete data to make this request'
                });
    }

    let Tasks = [];
    let Data  = req.body;

    // Try to find current data in MongoDB
    Tasks.push(function findMongoDataByState(doNext) {
      WeekDataMongo
        .findOne({
          'name'            : Data.estado,
          'date.from'       : Data.dateFrom,
          'date.to'         : Data.dateTo,
          'cities.county_id': req.params.city
          // 'cities.stations' : {
          //   $size: 0
          // }
        })
        .exec((err, state) => {
          if (err) {
            Colog.error(`ERROR: Ops!! Something. I can not find data in mongo => ${err}`);
            return doNext(err, false, {});
          }

          if (state && !Object.keys(state).length) {
            Colog.warning(`WARNING: This city may not exists yet!`);
            return doNext(null, false, {});
          }

          var cityHasStations = state._doc.cities.filter((el) => {
            return el.stations.length > 0
          });

          if (!cityHasStations.length) {
            Colog.success(`SUCESS: I find data. Lets work...`);
            return doNext(null, true, state._doc);
          }

          if (cityHasStations.length) {
            Colog.success(`SUCESS: I find data already updated. Rendering...`);
            return doNext(null, false, state._doc);
          }

      });
    });

    Tasks.push(function getStationsFromState(status, stateData, doNext) {
      if (!status) {
        console.log('passou 1')
        return doNext(null, false, stateData);
      }

      Async.forEachOf(stateData.cities, (city, key, doNextSubCity) => {
        Async.forEachOf(CrawlerMocks.fuelTypes, (fuel, keyFuel, doNextSubFuel) => {
          let formData = {
            cod_semana      : Data.cod_Semana,
            desc_semana     : Data.desc_Semana,
            cod_combustivel : fuel.id,
            desc_combustivel: fuel.desc,
            selMunicipio    : req.params.city,
            tipo            : Data.tipo,
          };

          RequestAdapter.build('POST', 'http://www.anp.gov.br/preco/prc/Resumo_Semanal_Posto.asp', formData,
          (err, response, body) => {

            if (err || response.statusCode != 200) {
              Colog.error('ERROR: Ops!! I can not get ANP data. Please try again and I will check what is happen');
              return doNext(err, false, false);
            }

            let $     = CheerioAdapter.loadCheerio(body);
            let table = $('.multi_box3 table tr');

            Async.forEachOf(table, (el, keyEl, doNextSubTd) => {
              let td = $(table[keyEl]).find('td');

              city.stations.push({
                name       : CheerioAdapter.getValueByMock($, td, CrawlerMap.tableValues.stations.name),
                address    : CheerioAdapter.getValueByMock($, td, CrawlerMap.tableValues.stations.address),
                area       : CheerioAdapter.getValueByMock($, td, CrawlerMap.tableValues.stations.area),
                flag       : CheerioAdapter.getValueByMock($, td, CrawlerMap.tableValues.stations.flag),
                prices     : [{
                  type     : fuel.name,
                  sellPrice: CheerioAdapter.getValueByMock($, td, CrawlerMap.tableValues.stations.prices.sellPrice),
                  buyPrice : CheerioAdapter.getValueByMock($, td, CrawlerMap.tableValues.stations.prices.buyPrice),
                  saleMode : CheerioAdapter.getValueByMock($, td, CrawlerMap.tableValues.stations.prices.saleMode),
                  provider : CheerioAdapter.getValueByMock($, td, CrawlerMap.tableValues.stations.prices.provider),
                  date     : CheerioAdapter.getValueByMock($, td, CrawlerMap.tableValues.stations.prices.date)
                }]
              });
            }, (err) => {
              return doNextSubTd();
            });

            return doNextSubFuel();
          });

        }, (err) => {
          return doNextSubCity();
        });

      }, (err) => {
        return doNext(null, true, stateData);
      });

    });

    Tasks.push(function updateMongo(status, stateData, doNext) {
      if (!status) {
        console.log('passou 2', stateData.name)
        return doNext(null, false, stateData);
      }

      WeekDataMongo
        .findByIdAndUpdate(stateData._id, {
          $set: stateData
        }, (err, created) => {
          if (err) {
            Colog.warning(`ERROR: Ops!! I can not update in MongoDB => ${err}`);
            return doNext(err, false, stateData);
          }

          Colog.success(`SUCESS: Yeah!! I updated a data in MongoDB `);
          return doNext(null, true, stateData);
        });
    });

    Async.waterfall(Tasks, function(err, status, result) {
      console.log(err, status, result)
      if (!status && Object.keys(result).length) {
        console.log('passou 3')
        return res.status(200)
                  .json({
                    status   : true,
                    data     : {
                      station: result
                    },
                    message  : 'Date already updated'
                  });
      }

      if (!status) {
        return res.status(200)
                  .json({
                    status : false,
                    data     : {
                      station: []
                    },
                    message: 'Error during tasks'
                  });
      }

      if (!result) {
        return res.status(200)
                  .json({
                    status   : true,
                    data     : {
                      station: []
                    },
                    message  : 'Empty result'
                  });
      }

      return res.status(200)
                .json({
                  status   : true,
                  data     : {
                    station: result
                  },
                  message  : 'Everything ok. This is the station data'
                });
    });

  };

})();

module.exports = ComponentAction