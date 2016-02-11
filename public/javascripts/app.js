var thisApp = angular.module('Roboplant', ['ui.router', 'ngResource'])

.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise("/");

  $stateProvider
  .state('home', {
    url: '/',
    templateUrl: 'views/home.html',
    controller: 'HomeController'
  })
  .state('client', {
    url: '/client/:clientId',
    templateUrl: 'views/client.html',
    controller: 'ClientController',
    params: {clientExists: null}
  })
  .state('module', {
    url: '/module/:clientId/:moduleId',
    templateUrl: 'views/module.html',
    controller: 'ModuleController',
    params: {moduleObj: null}
  })

})
