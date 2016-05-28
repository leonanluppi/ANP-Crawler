(function(angular) {
  'use strict';

  /** @ngInject */
  var Factory = function MainResource(HttpAdapter) {

    function getDataFromHistory(state) {
      return HttpAdapter.request('GET', [state]);
    }

    function getDataFromCrawler(state, currentParams) {
      return HttpAdapter.request('POST', [state], currentParams);
    }

    var factory = {
      getDataFromHistory: getDataFromHistory,
      getDataFromCrawler: getDataFromCrawler
    };

    return factory;
  };

  angular
    .module('softruck.modules.main')
    .factory('MainResource', Factory);
})(angular);
