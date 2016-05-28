(function(angular) {
  'use strict';

  angular
      .module('softruck', [
        'softruck.constants',
        'softruck.configs',
        'softruck.translation',

        'softruck.helpers.http',

        'softruck.components.header',
        'softruck.components.footer',

        'softruck.modules.base',
        'softruck.modules.main',
        'softruck.modules.station'
      ]);
})(angular);