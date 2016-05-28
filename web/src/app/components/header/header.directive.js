(function(angular) {
  'use strict';

  /** @ngInject */
  var Directive = function softruckHeader() {

    var configs = {
      restrict    : 'EA',
      transclude  : true,
      templateUrl : 'app/components/header/header.html',
      controller  : 'HeaderController',
      controllerAs: 'header_vm',
      link        : link,
    };

    return configs;

    function link($scope, $element, $attr) {}
  };

  angular
    .module('softruck.components.header')
    .directive('softruckHeader', Directive);
})(angular);
