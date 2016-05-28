(function(angular) {
  'use strict';

  /** @ngInject */
  var Directive = function softruckFooter() {

    var configs = {
      restrict    : 'EA',
      transclude  : true,
      templateUrl : 'app/components/footer/footer.html',
      controller  : 'FooterController',
      controllerAs: 'footer_vm',
      link        : link,
    };

    return configs;

    function link($scope, $element, $attr) {}
  };

  angular
    .module('softruck.components.footer')
    .directive('softruckFooter', Directive);
})(angular);
