'use strict';

let CrawlerMocks = (() => {
  let Mocks = {
    fuelTypes: [{
      name : 'Gasolina',
      value: '487*Gasolina',
      desc : ' - Gasolina R$/l',
      id   : '487'
    }, {
      name : 'Etanol',
      value: '643*Etanol',
      desc : ' - Etanol R$/l',
      id   : '643'
    }, {
      name: 'GNV',
      value: '476*GNV',
      desc : ' - GNV R$/m3',
      id   : '476'
    }, {
      name : 'Diesel',
      value: '532*Diesel',
      desc : ' - Diesel R$/l',
      id   : '532'
    }, {
      name : 'Diesel S10',
      value: '812*Diesel@S10',
      desc : ' - Diesel S10 R$/l',
      id   : '812'
    }, {
      name : 'GLP',
      value: '462*GLP',
      desc : ' - GLP R$/13kg',
      id   : '462'
    }],
    txtValor: 'YVDME'
  };

  return Mocks;
})();

module.exports = CrawlerMocks;