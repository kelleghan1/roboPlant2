var thisApp = angular.module('Roboplant', ['ui.router', 'ngResource'])

.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise("/");

  $stateProvider
  .state('home', {
    url: '/',
    templateUrl: 'views/home.html',
    controller: 'HomeController'
  })

})

// .factory('ClientFactory', function($resource) {
//   return $resource('/api/entries/:id', {id: 'theID'}); // Note the full endpoint address
// });
