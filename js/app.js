'use strict';


// Declare app level module which depends on filters, and services
angular.module('devxiveDevDocs', ['angulartics', /*'angulartics.google.analytics',*/ 'devxiveDevDocs.filters', 'devxiveDevDocs.services', 'devxiveDevDocs.directives']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/:lang/:part1', {templateUrl: 'partials/docPage.html', controller: DocController});
    $routeProvider.when('/:lang/:part1/:part2', {templateUrl: 'partials/docPage.html', controller: DocController});
    $routeProvider.when('/:lang/:part1/:part2/:part3', {templateUrl: 'partials/docPage.html', controller: DocController});
    $routeProvider.when('/:lang/:part1/:part2/:part3/:part4', {templateUrl: 'partials/docPage.html', controller: DocController});

    $routeProvider.otherwise({redirectTo: '/en/home.md'});
  }]);
