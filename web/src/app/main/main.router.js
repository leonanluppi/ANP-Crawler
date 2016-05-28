(function(angular) {
  'use strict';

  /** @ngInject */
  var ModuleRouter = function ModuleRouter($stateProvider) {

    $stateProvider
      .state('softruck.main', {
        url         : '/',
        templateUrl : 'app/main/main.html',
        controller  : 'MainController',
        controllerAs: 'main_vm',
        resolve     : {}
      })
  };

  angular
    .module('softruck.modules.main')
    .config(ModuleRouter);
})(angular);
