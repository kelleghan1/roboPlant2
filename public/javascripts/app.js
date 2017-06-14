var thisApp = angular.module('Roboplant', ['ui.router', 'ngResource', 'angularMoment'])

.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise("/");
  // $momentProvider.asyncLoading(false)
  // .scriptUrl('node_modules/moment/angular-momentjs.js');

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
