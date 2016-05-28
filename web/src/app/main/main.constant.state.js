(function(angular) {
  'use strict';

  var avaiableState = {
      availableOptions: [{
        id  : 'AC*ACRE',
        name: 'Acre'
      }, {
        id  : 'AL*ALAGOAS',
        name: 'Alagoas'
      }, {
        id  : 'AP*AMAPA',
        name: 'Amapa'
      }, {
        id  : 'TO*TOCANTINS',
        name: 'Tocantins'
      }, {
        id  : 'SE*SERGIPE',
        name: 'Sergipe'
      }, {
        id  : 'SP*SAO@PAULO',
        name: 'Sao Paulo'
      }, {
        id  : 'SC*SANTA@CATARINA',
        name: 'Santa Catarina'
      }, {
        id  : 'RR*RORAIMA',
        name: 'Roraima'
      }, {
        id  : 'RO*RONDONIA',
        name: 'Rondonia'
      }, {
        id  : 'RS*RIO@GRANDE@DO@SUL',
        name: 'Rio Grande do Sul'
      }, {
        id  : 'RN*RIO@GRANDE@DO@NORTE',
        name: 'Rio Grande do Norte'
      }, {
        id  : 'RJ*RIO@DE@JANEIRO',
        name: 'Rio de Janeiro'
      }, {
        id  : 'PI*PIAUI',
        name: 'Piaui'
      }, {
        id  : 'PE*PERNAMBUCO',
        name: 'Pernambuco'
      }, {
        id  : 'PR*PARANA',
        name: 'Parana'
      }, {
        id  : 'PB*PARAIBA',
        name: 'Paraiba'
      }, {
        id  : 'PA*PARA',
        name: 'Para'
      }, {
        id  : 'MG*MINAS@GERAIS',
        name: 'Minas Gerais'
      }, {
        id  : 'MS*MATO@GROSSO@DO@SUL',
        name: 'Mato Grosso do Sul'
      }, {
        id  : 'MT*MATO@GROSSO',
        name: 'Mato Grosso'
      }, {
        id  : 'MA*MARANHAO',
        name: 'Maranhao'
      }, {
        id  : 'GO*GOIAS',
        name: 'Goias'
      }, {
        id  : 'ES*ESPIRITO@SANTO',
        name: 'Espirito Santo'
      }, {
        id  : 'DF*DISTRITO@FEDERAL',
        name: 'Distrito Federal'
      }, {
        id  : 'CE*CEARA',
        name: 'Ceara'
      }, {
        id  : 'BA*BAHIA',
        name: 'Bahia'
      }, {
        id  : 'AM*AMAZONAS',
        name: 'Amazonas'
      }],
      selectedOption: {
        id  : '-1',
        name: 'Selecione um estado'
      }
    };

  angular
    .module('softruck.modules.main')
    .constant('avaiableState', avaiableState);

})(angular);