'use strict';

let CrawlerMapping = (() => {
  let Maps = {
    tableValues: {
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
    }
  };

  return Maps;
})();

module.exports = CrawlerMapping;