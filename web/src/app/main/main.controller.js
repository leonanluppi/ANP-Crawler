(function(angular) {
  'use strict';

  /** @ngInject */
  var Controller = function MainController(MainResource, BaseService, avaiableState, $log, $translate) {

    var vm = this;

    vm.history           = [];
    vm.stateSelectData   = avaiableState;
    vm.translations      = {
      labelSelectState    : $translate.instant('LABEL_SELECT_STATE'),
      buttonSearch        : $translate.instant('LABEL_SEARCH'),
      table               : {
        labelCounty       : $translate.instant('LABEL_COUNTY'),
        averageMargin     : $translate.instant('LABEL_AVERAGE_MARGIN'),
        maxPrice          : $translate.instant('LABEL_MAX_PRICE'),
        minPrice          : $translate.instant('LABEL_MIN_PRICE'),
        standardDeviation : $translate.instant('LABEL_STANDARD_DEVIATION'),
        averagePrice      : $translate.instant('LABEL_AVERAGE_PRICE'),
      },
      labelSearching      : $translate.instant('LABEL_SEARCHING'),
      selectAState        : $translate.instant('LABEL_SELECT_STATE'),
    };

    vm.checkState             = checkState;
    vm.isDisabledSearchButton = isDisabledSearchButton;

    function checkState(state) {
      MainResource
        .getDataFromHistory(state.id)
        .then(function(result) {

          BaseService.setParams(result.data.params);

          if (!result.status && !result.data) {
            $log.error(result.message);
          }

          if (result.status && Object.keys(result.data.params).length && !Object.keys(result.data.history).length) {
            $log.info('Empty result');
            return getDataFromCrawler(state);
          }

          $log.info('Result:', result.data.history);
          return vm.history = result.data.history;
        })
        .catch(function(err) {
          $log.error('Error:', err);
        });
    }

    function getDataFromCrawler(state) {
      vm.crawlerGetting = true;
      MainResource
        .getDataFromCrawler(state.id, BaseService.getParams())
        .then(function(result) {
          if (!result || result.length === 0) {
            $log.info('Empty result');
            return vm.history;
          }

          vm.crawlerGetting = false;
          $log.info('Result:', result);
          return vm.history = result.data.history;
        })
        .catch(function(err) {
          $log.error('Error:', err);
        });
    }

    function isDisabledSearchButton(data) {
      return data == -1;
    }
  };

  angular
    .module('softruck.modules.main')
    .controller('MainController', Controller);
})(angular);
