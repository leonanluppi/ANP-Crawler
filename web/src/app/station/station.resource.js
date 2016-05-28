(function(angular) {
  'use strict';

  /** @ngInject */
  var Factory = function StationsResource(HttpAdapter) {

    function getStations(city, currentParams) {
      return HttpAdapter.request('POST', ['stations', city], currentParams);
    }

    var factory = {
      getStations: getStations
    };

    return factory;
  };

  angular
    .module('softruck.modules.station')
    .factory('StationsResource', Factory);
})(angular);
