var thisApp = angular.module('Roboplant', [
  'ui.router',
  'ngResource',
  'angularMoment',
  'ngAnimate',
  'ngTouch',
  'ui.bootstrap',
  'cgPrompt'
  // 'accordion'
])

.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise("/");

  $stateProvider
  .state('home', {
    url: '/',
    templateUrl: 'views/home.html',
    controller: 'HomeController'
  })
  .state('client', {
    url: '/client/:clientName/:clientId',
    templateUrl: 'views/client.html',
    controller: 'ClientController',
    params: {clientExists: null}
  })
  .state('module', {
    url: '/module/:clientName/:moduleName',
    templateUrl: 'views/module.html',
    controller: 'ModuleController',
    params: {moduleObj: null}
  })

})
