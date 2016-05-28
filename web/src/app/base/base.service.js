(function(angular) {
  'use strict';

  /** @ngInject */
  var Service = function BaseService() {

    var params = {};

    this.getParams = function getParams(state) {
      return params;
    }

    this.setParams = function setParams(_params) {
      return params = _params;
    }

    var service = {
      getParams: this.getParams,
      setParams: this.setParams
    };

    return service;
  };

  angular
    .module('softruck.modules.base')
    .service('BaseService', Service);
})(angular);
