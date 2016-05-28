(function(angular) {
  'use strict';

  angular
    .module('softruck.constants', [])
    .constant('API_HOSTS', {
      development: {
        api: 'http://localhost:3000',
      },
      production: {
        api: 'http://localhost:3000',
      }
    })
    .constant('ENV', 'development')
})(angular);
