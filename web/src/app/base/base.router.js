(function(angular) {
  'use strict';

  /** @ngInject */
  var ModuleRouter = function ModuleRouter($stateProvider) {

    $stateProvider
      .state('softruck', {
        abstract    : true,
        templateUrl : 'app/base/base.html',
        controller  : 'BaseController',
        controllerAs: 'base_vm',
        resolve     : {}
      })
  };

  angular
    .module('softruck.modules.base')
    .config(ModuleRouter);
})(angular);
