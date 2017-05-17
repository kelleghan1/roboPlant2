
thisApp
.controller('HomeController', [
  'HomeService',
  '$stateParams',
  '$state',
  '$scope',
  '$http',
  function(
    HomeService,
    $stateParams,
    $state,
    $scope,
    $http
  ){

    $scope.submitClient = function(){
      HomeService.submitClient($scope.clientId).then(function(result){
        console.log(result);
        if (result.data.clientExists) {
          console.log('CLIENT EXISTS');
          $state.go('client', {clientId: $scope.clientId, clientExists: result.data.clientExists});
        }else{
          $state.go('client', {clientId: $scope.clientId, clientExists: result.data.clientExists});
        }
      })
    };

  }
])

.controller('ClientController', [
  'HomeService',
  '$stateParams',
  '$state',
  '$scope',
  '$http',
  function(
    HomeService,
    $stateParams,
    $state,
    $scope,
    $http
  ){

    $scope.clientId = $stateParams.clientId;
    $scope.modules = [];
    $scope.moduleTypes = ['Environmental', 'Tote', 'Trimmer', 'Plant'];
    $scope.sensorIds = [21, 23];
    $scope.scaleIds = [22];

    console.log($stateParams);

    // if ($stateParams.clientExists) {
    HomeService.getClient($scope.clientId)
    .then(function(res){
      console.log('getClient', res);
      $scope.modules = res.data[0].modules;
    });
    // }

    $scope.submitModule = function(){

      var createModule = {
        clientId: this.clientId,
        moduleId: this.moduleId,
        moduleType: this.moduleType
      }

      HomeService.submitModule(createModule).then(function(result){
        console.log(result);
        HomeService.getClient($scope.clientId)
        .then(function(res){
          console.log('getClient', res);
          $scope.modules = res.data[0].modules;
        });
      });

    };


    $scope.updateModule = function(){
      console.log(this);

      var updateModule = {
        clientId: $scope.clientId,
        moduleId: this.module.moduleId,
        moduleType: this.module.moduleType,
        moduleNotes: this.notes
      }

      console.log(updateModule);

      HomeService.updateModule(updateModule).then(function(result){
        console.log(result);

      })


    }


  }
])