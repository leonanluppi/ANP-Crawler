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

  let validateRequest = (body) => {
    if(!body.state.length) {
      Colog.error(`ERROR: Ops!! Something happens. I can not validate your request completely, please look up body request or params request`);

      return false;
    }

    return true;
  };

  return function middleware(req, res, next) {

    if (!validateRequest(req.params)) {
      return res.status(400)
                .json({
                  status : false,
                  message: 'You must need complete data to make this request'
                });
    }

    let Tasks         = [];
    let Data          = req.body;

    // Get all city in request
    Tasks.push(function getCitiesFromState(doNext) {
      let formData = {
        selSemana      : Data.selSemana,
        desc_Semana    : Data.desc_Semana,
        cod_Semana     : Data.cod_Semana,
        tipo           : Data.tipo,
        Cod_Combustivel: CrawlerMocks.fuelTypes[0].id,
        selEstado      : req.body.selEstado,
        selCombustivel : CrawlerMocks.fuelTypes[0].value,
        txtValor       : CrawlerMocks.txtValor,
        image1         : ''
      };
      let dataCrawler = {
        name  : Data.estado,
        cities: [],
        date  : {
          from: Data.dateFrom,
          to  : Data.dateTo
        }
      };

      RequestAdapter.build('POST', 'http://www.anp.gov.br/preco/prc/Resumo_Por_Estado_Municipio.asp', formData,
      (err, response, body) => {

        if (err || response.statusCode != 200) {
          Colog.error('ERROR: Ops!! I can not get ANP data. Please try again and I will check what is happen');
          return doNext(err, false, {});
        }

        Colog.info('INFO: Everything is okay until now. Working on ANP data');

        let $     = CheerioAdapter.loadCheerio(body);
        let table = $('table tr');

        Async.forEachOf(table, (el, key, doNextSub) => {
          if (key < 3) {
            return;
          }

          let td     = $(table[key]).find('td');
          let county = $(td).find('.linkpadrao')
                          .attr('href')
                          .match(/'(.*?)'/)[0]
                          .replace(/'/g, '');

          dataCrawler.cities.push({
            name      : CheerioAdapter.getValueByMock($, td, CrawlerMap.tableValues.name),
            county_id : county,
            statistics: [],
            stations  : []
          });


        }, (err) => {
          return doNextSub();
        });
        return doNext(null, true, dataCrawler);
      });

    });

    // Get all statistict by state and fuel
    Tasks.push(function getStatisticFromState(status, dataCrawler, doNext) {
      if (!status) {
        return doNext(null, false, {});
      }

      Async.forEachOf(dataCrawler.cities, (city, key, doNextSubCity) => {
        Async.forEachOf(CrawlerMocks.fuelTypes, (fuel, keyFuel, doNextSubFuel) => {
          let formData = {
            selSemana      : Data.selSemana,
            desc_Semana    : Data.desc_Semana,
            cod_Semana     : Data.cod_Semana,
            tipo           : Data.tipo,
            Cod_Combustivel: fuel.id,
            selEstado      : req.body.selEstado,
            selCombustivel : fuel.value,
            txtValor       : CrawlerMocks.txtValor,
            image1         : ''
          };

          RequestAdapter.build('POST', 'http://www.anp.gov.br/preco/prc/Resumo_Por_Estado_Municipio.asp', formData,
          (err, response, body) => {

            if (err || response.statusCode != 200) {
              Colog.error('ERROR: Ops!! I can not get ANP data. Please try again and I will check what is happen');
              return doNext(err, false, {});
            }

            Colog.info('INFO: Everything is okay until now. Working on ANP data');

            let $     = CheerioAdapter.loadCheerio(body);
            let table = $('table tr');
            let td    = $(table[key + 3]).find('td');

            city.statistics.push({
              type               : fuel.name,
              desc_fuel          : fuel.desc,
              id_fuel            : fuel.id,
              consumerPrice      : [{
                averagePrice     : CheerioAdapter
                                      .getValueByMock($, td, CrawlerMap.tableValues.consumerPrice.averagePrice),
                standardDeviation: CheerioAdapter
                                      .getValueByMock($, td, CrawlerMap.tableValues.consumerPrice.standardDeviation),
                minPrice         : CheerioAdapter
                                      .getValueByMock($, td, CrawlerMap.tableValues.consumerPrice.minPrice),
                maxPrice         : CheerioAdapter
                                      .getValueByMock($, td, CrawlerMap.tableValues.consumerPrice.maxPrice),
                averageMargin    : CheerioAdapter
                                      .getValueByMock($, td, CrawlerMap.tableValues.consumerPrice.averageMargin)
              }],
              distributionPrice: [{
                averagePrice     : CheerioAdapter
                                      .getValueByMock($, td, CrawlerMap.tableValues.distributionPrice.averagePrice),
                standardDeviation: CheerioAdapter
                                      .getValueByMock($, td, CrawlerMap.tableValues.distributionPrice.standardDeviation),
                minPrice         : CheerioAdapter
                                      .getValueByMock($, td, CrawlerMap.tableValues.distributionPrice.minPrice),
                maxPrice         : CheerioAdapter
                                      .getValueByMock($, td, CrawlerMap.tableValues.distributionPrice.maxPrice)
              }]
            });

            return doNextSubFuel();
          });

        }, (err) => {
          return doNextSubCity();
        });

      }, (err) => {
        return doNext(null, true, dataCrawler);
      });

    });

    // Save in MongoDB
    Tasks.push(function saveMongo(status, dataCrawler, doNext) {
      if (!status) {
        return doNext(null, false, {});
      }

      WeekDataMongo
        .create(dataCrawler, (err, created) => {
          if (err) {
            Colog.warning(`ERROR: Ops!! I can not create in MongoDB => ${err}`);
            return doNext(err, false, {});
          }

          Colog.success(`SUCESS: Yeah!! I created a new data in MongoDB `);
          return doNext(null, true, dataCrawler);
        });
    });

    // Execute my control flow and send to web
    Async.waterfall(Tasks, function(err, status, result) {
      if (!status) {
        return res.status(200)
                  .json({
                    status : false,
                    data     : {
                      history: []
                    },
                    message: 'Error during tasks'
                  });
      }

      if (!result) {
        return res.status(200)
                  .json({
                    status   : true,
                    data     : {
                      history: []
                    },
                    message  : 'Empty result'
                  });
      }

      return res.status(200)
                .json({
                  status   : true,
                  data     : {
                    history: result
                  },
                  message  : 'Everything ok. This is the history data'
                });
    });

  };

})();

module.exports = ComponentAction