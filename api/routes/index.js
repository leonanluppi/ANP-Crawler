'use strict';

var express = require('express');
var router = express.Router();
var Request = require('request');
var Cheerio = require('cheerio');
let Async   = require('async');
let CrawlerMap   = require('./crawler.map');
let CrawlerMock   = require('./crawler.mock');

/* GET home page. */
router.get('/', function(req, res, next) {

  let Tasks = [];
  let Data  = [];
  let loadCheerio = (body) => {
    return Cheerio.load(body, {
      normalizeWhitespace: true,
      xmlMode: false
    });
  };
  let getDefaultHeader = () => {
    return {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'
    };
  };
  let requestBuilder = (method, url, form) => {
    return form
             ?
             {
              method  : method,
              gzip    : true,
              encoding: null,
              url     : url,
              headers : getDefaultHeader(),
              form    : form
            }
            :
            {
              method  : method,
              gzip    : true,
              encoding: null,
              url     : url,
              headers : getDefaultHeader()
            };
  };


  Tasks.push((doNextMain) => {
    Request(requestBuilder('GET', 'http://www.anp.gov.br/preco/prc/Resumo_Por_Estado_Index.asp'), function onResponse(err, res, body) {
      if (!err && res.statusCode == 200) {
        return doNextMain(null, true, body);
      }

      return doNextMain(null, false);
    });
  });

  Tasks.push((status, body, doNextMain) => {
    if (!status) {
      return doNextMain(null, false);
    }

    let $      = loadCheerio(body);
    let params = {
      selSemana      : $('input[name="selSemana"]').val(),
      desc_Semana    : $('input[name="desc_Semana"]').val(),
      cod_Semana     : $('input[name="cod_Semana"]').val(),
      tipo           : $('input[name="tipo"]').val(),
      Cod_Combustivel: $('input[name="Cod_Combustivel"]').val()
    };

    return doNextMain(null, true, params);
  });

  Tasks.push((status, params, doNextMain)  => {
    if (!status) {
      return doNextMain(null, false);
    }

    params.selEstado = 'ES*ESPIRITO@SANTO';
    params.selCombustivel = '487*Gasolina';
    Request(requestBuilder('POST', 'http://www.anp.gov.br/preco/prc/Resumo_Por_Estado_Municipio.asp', {
      selSemana      : params.selSemana,
      desc_Semana    : params.desc_Semana,
      cod_Semana     : params.cod_Semana,
      tipo           : params.tipo,
      Cod_Combustivel: params.Cod_Combustivel,
      selEstado      : params.selEstado,
      selCombustivel : params.selCombustivel,
      txtValor       : 'YVDME',
      image1         : ''
    }), function onResponse(err, res, body) {
      if (!err && res.statusCode == 200) {
        return doNextMain(null, true, params, body);
      }

      return doNextMain(null, false);
    });
  });

  Tasks.push((status, params, body, doNextMain) => {
    if (!status) {
      return doNextMain(null, false);
    }

    let $ = loadCheerio(body);
    var getValueByMock = function getValueByMock(element, mockValue) {
      return $(element).eq(mockValue).text();
    };

    let table = $('table tr');
    for (let index = 3; index < table.length; index++) {
      let td = $(table[index]).find('td');

      CrawlerMock.name = getValueByMock(td, CrawlerMap.name);

      CrawlerMock.statistics.push({
        type               : params.selCombustivel.match(/[^*]*$/)[0],
        consumerPrice      : [{
          averagePrice     : getValueByMock(td, CrawlerMap.consumerPrice.averagePrice),
          standardDeviation: getValueByMock(td, CrawlerMap.consumerPrice.standardDeviation),
          minPrice         : getValueByMock(td, CrawlerMap.consumerPrice.minPrice),
          maxPrice         : getValueByMock(td, CrawlerMap.consumerPrice.maxPrice),
          averageMargin    : getValueByMock(td, CrawlerMap.consumerPrice.averageMargin)
        }],
        distributionPrice  : [{
          averagePrice     : getValueByMock(td, CrawlerMap.distributionPrice.averagePrice),
          standardDeviation: getValueByMock(td, CrawlerMap.distributionPrice.standardDeviation),
          minPrice         : getValueByMock(td, CrawlerMap.distributionPrice.minPrice),
          maxPrice         : getValueByMock(td, CrawlerMap.distributionPrice.maxPrice)
        }]
      });
    }

    return doNextMain(null, true, val);
  });

  Async.waterfall(Tasks, function(err, status, result) {
    if (!status) {
      console.log('Error', err)
      return;
    }

    console.log('Success ', result);
    res.render('index', { title: JSON.stringify(result) });
  });
});

module.exports = router;
