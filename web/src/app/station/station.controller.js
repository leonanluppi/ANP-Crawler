(function(angular) {
  'use strict';

  /** @ngInject */
  var Controller = function StationsController(StationsResource, BaseService, $stateParams, $state, $log, $translate) {

    var vm = this;

    vm.stations     = [];
    vm.translations = {
      table               : {
        companyName       : $translate.instant('LABEL_COMPANY_NAME'),
        address           : $translate.instant('LABEL_ADDRESS'),
        area              : $translate.instant('LABEL_AREA'),
        flag              : $translate.instant('LABEL_FLAG'),
        sellPrice         : $translate.instant('LABEL_SELL_PRICE'),
        buyPrice          : $translate.instant('LABEL_BUY_PRICE'),
        saleMode          : $translate.instant('LABEL_SALE_MODE'),
        provider          : $translate.instant('LABEL_PROVIDER'),
        date              : $translate.instant('LABEL_DATE'),
      },
      labelSearching     : $translate.instant('LABEL_SEARCHING')
    };

    (function initialize() {
      if (!$stateParams.city || !Object.keys(BaseService.getParams()).length) {
        $state.go('softruck.main');
      }

      return checkState($stateParams.city);
    })();

    function checkState(city) {
      vm.crawlerGetting = true;
      StationsResource
        .getStations(city, BaseService.getParams())
        .then(function(result) {
          if (!result.status && !result.data) {
            $log.error(result.message);
          }

          vm.crawlerGetting = false;
          $log.info('Result:', result.data.station);
          return vm.stations = result.data.station;
        })
        .catch(function(err) {
          $log.error('Error:', err);
        });
    }
  };

  angular
    .module('softruck.modules.station')
    .controller('StationsController', Controller);
})(angular);
