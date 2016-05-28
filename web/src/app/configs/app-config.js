(function(angular) {
  'use strict';

  var setHTTPAjaxConfig = function onHTTPAjaxConfig($httpProvider, ENV) {
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.withCredentials = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  }

  var setLoggingDebug = function setLoggingDebug($logProvider) {
    $logProvider.debugEnabled(true);
  };

  /** @ngInject */
  var Configuration = function(ENV, $httpProvider, $logProvider, $compileProvider) {
    setHTTPAjaxConfig($httpProvider, ENV);
    setLoggingDebug($logProvider);

    $compileProvider.debugInfoEnabled(false);
  };

  angular
    .module('softruck.configs', [
            'ui.router'
    ])
    .config(Configuration);
})(angular);
