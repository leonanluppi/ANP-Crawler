(function(angular) {
  'use strict';

  /** @ngInject */
  var ModuleRouter = function ModuleRouter($stateProvider) {

    $stateProvider
      .state('softruck.station', {
        url         : '/stations/:city',
        templateUrl : 'app/station/station.html',
        controller  : 'StationsController',
        controllerAs: 'station_vm',
        resolve     : {}
      })
  };

  angular
    .module('softruck.modules.station')
    .config(ModuleRouter);
})(angular);
