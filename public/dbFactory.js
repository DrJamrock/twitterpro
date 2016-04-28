angular.module('db.factory', [])

.factory('dbFactory', ['$http', 'Server', function($http, Server) {
  var factory = {};

  // crud functionality for all models

  // use '/all/true' to get all models
  factory.getModel = function(type, searchTerms, callback) {
    $http.get(Server.url + 'api/models/' + type + searchTerms).then(function(results) {
      callback(results.data);
    });
  };

  factory.deleteModel = function(type, searchTerms, callback) {
    $http.delete(Server.url + 'api/models/' + type + searchTerms).then(function(results) {
      callback(results.data);
    });
  };

  factory.updateModel = function(type, payload, callback) {
    $http.put(Server.url + 'api/models/' + type, payload).then(function(results) {
      callback(results.data);
    });
  };

  factory.createModel = function(type, payload, callback) {
    $http.post(Server.url + 'api/models/' + type, payload).then(function(results) {
      callback(results.data);
    });
  };


  return factory;
}, ]);
