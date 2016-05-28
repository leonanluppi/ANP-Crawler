(function(angular) {
  'use strict';

  /** @ngInject */
  var Factory = function HttpAdapter($http, $q, API_HOSTS, ENV) {
    var host = API_HOSTS[ENV] && API_HOSTS[ENV].api;

    var uriBuilder = function uriBuilder(values) {
      values = Array.isArray(values) && values || [];
      values = values.length > 0
               ? values.join('/')
               : false;

      return values
             ?
             '/'.concat(values)
             : '';
    };

    var queryStringBuilder = function queryStringBuilder(values) {
      var queryString = [];

      for (var value in values) {
        if (values.hasOwnProperty(value)) {
          queryString.push(encodeURIComponent(value).concat('=')
                                                    .concat(encodeURIComponent(values[value])));
        }
      }

      return !queryString.length
             ? ''
             : '?'.concat(queryString.join('&'));
    };

    var request = function request(method, uri, data) {
      var defer = $q.defer();

      if (!angular.isArray(uri) || !uri.length){
        console.warning('HttpAdapter WARNING: URI is a required array param');
      }

      var uri = String(host).concat(uriBuilder(uri));

      if (method.toLowerCase() === 'get') {
        uri = String(uri).concat(queryStringBuilder(data));

        $http
        .get(uri)
        .success(function(response) {
          defer.resolve(response);
        })
        .error(function(err) {
          defer.reject(err);
        });
      }

      $http({
        method: method.toLowerCase(),
        url   : uri,
        data  : data
      })
      .success(function(response) {
        defer.resolve(response);
      })
      .error(function(err) {
        defer.reject(err);
      });

      return defer.promise;
    };

    var factory = {
      request: request
    };

    return factory;
  };

  angular
    .module('softruck.helpers.http', [])
    .factory('HttpAdapter', Factory);
})(angular);
