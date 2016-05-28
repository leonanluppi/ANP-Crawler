'use strict';

let ComponentAction  = (() => {
  let CheerioAdapter = require('./adapters/cheerioAdapter');
  let RequestAdapter = require('./adapters/requestAdapter');
  let Async          = require('async');
  let Moment         = require('moment');
  let Colog          = require('colog');

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
                  data   : null,
                  message: 'You must need complete data to make this request'
                });
    }

    let Tasks = [];
    let Data  = {};

    Tasks.push(function requestParams(doNext) {
      RequestAdapter.build('GET', 'http://www.anp.gov.br/preco/prc/Resumo_Por_Estado_Index.asp', null,
      (err, response, body) => {

        if (err || response.statusCode != 200) {
          Colog.error('ERROR: Ops!! I can not get ANP data. Please try again and I will check what is happen');
          return doNext(err, false);
        }

        return doNext(null, true, body);
      });
    });

    Tasks.push(function getParams(status, body, doNext) {
      if (!status) {
        return doNext(null, false);
      }

      let $ = CheerioAdapter.loadCheerio(body);
      let date = $('input[name="desc_Semana"]').val().split(' ');

      Data = {
        selSemana      : $('input[name="selSemana"]').val(),
        desc_Semana    : $('input[name="desc_Semana"]').val(),
        cod_Semana     : $('input[name="cod_Semana"]').val(),
        tipo           : $('input[name="tipo"]').val(),
        Cod_Combustivel: $('input[name="Cod_Combustivel"]').val(),
        selEstado      : req.params.state,
        estado         : req.params.state.match(/[^*]*$/)[0],
        dateFrom       : date[1],
        dateTo         : date[3]
      };

      return doNext(null, true);
    });

    Tasks.push(function checkCurrentWeek(status, doNext) {
      if (!status) {
        return doNext(null, false);
      }

      WeekDataMongo
        .find({
          'name'     : Data.estado,
          'date.from': Data.dateFrom,
          'date.to'  : Data.dateTo
        })
        .exec((err, result) => {
          if (err) {
            Colog.error(`ERROR: Ops!! Something. I cant find any week data in mongo, happens some error => ${err}`);
            return doNext(err, false, {});
          }

          if (!result || !result.length) {
            Colog.info(`INFO: I can not find week data. I will get from ANP site`);
            return doNext(null, true, false);
          }

          Colog.info(`INFO: I find a week data. Rendering...`);
          return doNext(null, true, result);
      });

    });

    Async.waterfall(Tasks, function(err, status, result) {
      if (!status) {
        return res.status(200)
                  .json({
                    status : false,
                    data     : {
                      history: [],
                      params : Data
                    },
                    message: 'Error during tasks'
                  });
      }

      if (!result) {
        return res.status(200)
                  .json({
                    status   : true,
                    data     : {
                      history: [],
                      params : Data
                    },
                    message  : 'Empty result'
                  });
      }

      return res.status(200)
                .json({
                  status   : true,
                  data     : {
                    history: result[0],
                    params : Data
                  },
                  message  : 'Everything ok. This is the history data'
                });
    });
  };

})();

module.exports = ComponentAction