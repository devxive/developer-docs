'use strict';


// Declare app level module which depends on filters, and services
angular.module('devXiveDevDocs', [
  'ngRoute',
  'devXiveDevDocs.filters',
  'devXiveDevDocs.services',
  'devXiveDevDocs.directives',
  'devXiveDevDocs.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {templateUrl: 'partials/docPage.html', controller: 'MyCtrl1'});
  $routeProvider.when('/view2', {templateUrl: 'partials/docPage.html', controller: 'MyCtrl2'});

  $routeProvider.otherwise({redirectTo: '/view1'});
}]);