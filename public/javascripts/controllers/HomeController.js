
thisApp
.controller('HomeController', [
  'HomeService',
  '$scope',
  '$http',
  function(
    HomeService,
    $scope,
    $http
  ){



    $scope.submitClient = function(){

      console.log('SUBMITTED');

      HomeService.submitClient($scope.clientId).then(function(result){
        console.log(result);
      })
      .then(function(res){
        console.log('POSTED', res);
      })

    };


  }
])
