var express = require('express');
var router = express.Router();
var Request = require('request')
var Cheerio = require('cheerio');

/* GET home page. */
router.get('/', function(req, res, next) {
  let getCrawlerParams = () => {

  };

  Request({
    method  : 'GET',
    gzip    : true,
    encoding: null,
    url     : 'http://www.anp.gov.br/preco/prc/Resumo_Por_Estado_Index.asp',
    headers : {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'
    },
  }, function onResponse(err, response, body) {
    if (!err && response.statusCode == 200) {
      var $ = Cheerio.load(body, {
          normalizeWhitespace: true,
          xmlMode: false
      });

      var data = {
        selSemana: $('input[name="selSemana"]').val(),
        desc_Semana: $('input[name="desc_Semana"]').val(),
        cod_Semana: $('input[name="cod_Semana"]').val(),
        tipo: $('input[name="tipo"]').val(),
        Cod_Combustivel: $('input[name="Cod_Combustivel"]').val()
      };

      Request({
        method             : 'POST',
        gzip               : true,
        encoding           : null,
        url                : 'http://www.anp.gov.br/preco/prc/Resumo_Por_Estado_Municipio.asp',
        headers            : {
          'User-Agent'     : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'
        },
        form               : {
            selSemana      : '883*De 08/05/2016 a 14/05/2016',
            desc_Semana    : 'de 08/05/2016 a 14/05/2016',
            cod_Semana     : '883',
            tipo           : 1,
            Cod_Combustivel: '',
            selEstado      : 'ES*ESPIRITO@SANTO',
            selCombustivel : '487*Gasolina',
            txtValor       : 'YVDME',
            image1         : ''
        }
      }, function onResponse(errFinal, responseFinal, bodyFinal) {
        if (!errFinal && responseFinal.statusCode == 200) {
          var $ = Cheerio.load(bodyFinal, {
              normalizeWhitespace: true,
              xmlMode: false
          });


          data.selEstado = 'ES*ESPIRITO@SANTO';
          data.selCombustivel = '487*Gasolina';
          data.cities    = [];

          var tableValues = {
            name: 0,
            consumerPrice: {
              averagePrice: 2,
              standardDeviation: 3,
              minPrice: 4,
              maxPrice: 5,
              averageMargin: 6
            },
            distributionPrice: {
              averagePrice: 7,
              standardDeviation: 8,
              minPrice: 9,
              maxPrice: 10
            },
            stations: {
              name: 0,
              address: 1,
              area: 2,
              flag: 3,
              prices: {
                sellPrice: 4,
                buyPrice: 5,
                saleMode: 6,
                provider: 7,
                date: 8
              }
            }
          };


          var table = $('table tr');

          var getValueByMock = function getValueByMock(element, mockValue) {
            return $(element).eq(mockValue).text();
          };

          for (var i = 3; i < table.length; i++) {
            var td = $(table[i]).find('td');
            var val = {
              name: '',
              statistics: [],
              stations: []
            };

            val.name = getValueByMock(td, tableValues.name);
            val.statistics.push({
              type: data.selCombustivel.match(/[^*]*$/)[0],
              consumerPrice: [{
                averagePrice     : getValueByMock(td, tableValues.consumerPrice.averagePrice),
                standardDeviation: getValueByMock(td, tableValues.consumerPrice.standardDeviation),
                minPrice         : getValueByMock(td, tableValues.consumerPrice.minPrice),
                maxPrice         : getValueByMock(td, tableValues.consumerPrice.maxPrice),
                averageMargin    : getValueByMock(td, tableValues.consumerPrice.averageMargin)
              }],
              distributionPrice: [{
                averagePrice     : getValueByMock(td, tableValues.distributionPrice.averagePrice),
                standardDeviation: getValueByMock(td, tableValues.distributionPrice.standardDeviation),
                minPrice         : getValueByMock(td, tableValues.distributionPrice.minPrice),
                maxPrice         : getValueByMock(td, tableValues.distributionPrice.maxPrice)
              }]
            });

            Request({
              method             : 'POST',
              gzip               : true,
              encoding           : null,
              url                : 'http://www.anp.gov.br/preco/prc/Resumo_Semanal_Posto.asp',
              headers            : {
                'User-Agent'     : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'
              },
              form                : {
                  cod_semana      : '883',
                  desc_semana     : 'De 15/05/2016 a 21/05/2016',
                  cod_combustivel : '532',
                  desc_combustivel: ' - Diesel R$/l',
                  selMunicipio    : '1816*ARACRUZ',
                  tipo : 1,
              }
            }, function onResponse(errStations, responseStations, bodyStations) {
              if (!errStations && responseStations.statusCode == 200) {
                var $ = Cheerio.load(bodyStations, {
                    normalizeWhitespace: true,
                    xmlMode: false
                });

                var tableStations = $('.multi_box3 table tr');

                for (var i = 1; i < tableStations.length; i++) {
                  var tdStations = $(tableStations[i]).find('td');
                  val.stations.push({
                    name: getValueByMock(tdStations, tableValues.stations.name),
                    address: getValueByMock(tdStations, tableValues.stations.address),
                    area: getValueByMock(tdStations, tableValues.stations.area),
                    flag: getValueByMock(tdStations, tableValues.stations.flag),
                    prices: [{
                      type: data.selCombustivel.match(/[^*]*$/)[0],
                      sellPrice: getValueByMock(tdStations, tableValues.stations.prices.sellPrice),
                      buyPrice: getValueByMock(tdStations, tableValues.stations.prices.buyPrice),
                      saleMode: getValueByMock(tdStations, tableValues.stations.prices.saleMode),
                      provider: getValueByMock(tdStations, tableValues.stations.prices.provider),
                      date: getValueByMock(tdStations, tableValues.stations.prices.date)
                    }]
                  });

                  data.cities.push(val);
                }
              }
              var dataFinal = {
                name  :  data.selEstado.match(/[^*]*$/)[0],
                cities: data.cities
              };

              res.render('index', { title: JSON.stringify(dataFinal) });
            });
          }
        }
      });
    }
  });
});

module.exports = router;
