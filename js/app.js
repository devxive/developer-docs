'use strict';


// Declare app level module which depends on filters, and services
angular.module('devXiveDevDocs', [
    'ngRoute',
    'ngSanitize',
    'devXiveDevDocs.filters',
    'devXiveDevDocs.services',
    'devXiveDevDocs.directives'
  ]).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/:lang/:part1', {templateUrl: 'partials/docPage.html', controller: DocController});
    $routeProvider.when('/:lang/:part1/:part2', {templateUrl: 'partials/docPage.html', controller: DocController});
    $routeProvider.when('/:lang/:part1/:part2/:part3', {templateUrl: 'partials/docPage.html', controller: DocController});
    $routeProvider.when('/:lang/:part1/:part2/:part3/:part4', {templateUrl: 'partials/docPage.html', controller: DocController});

    $routeProvider.otherwise({redirectTo: 'en/home.md'});
  }]).
  config(function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
      // Allow same origin resource loads.
      'self',
      // Allow loading from our master repository. Notice the difference between * and **. (http://srv01.assets.example.com/, http://srv02.assets.example.com/, etc.)
      /* 'http://srv*.assets.example.com/**', */
      'https://github.com/devXive/developer-docs/**'
    ]);
    // The blacklist overrides the whitelist so the open redirect here is blocked.
    $sceDelegateProvider.resourceUrlBlacklist([
      /*'http://myapp.example.com/clickThru**'*/
    ]);
  });
