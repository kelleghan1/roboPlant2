
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
        // console.log(result);
        if (result.data.clientExists) {
          // console.log('CLIENT EXISTS');
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

    // console.log($stateParams);

    // if ($stateParams.clientExists) {
    HomeService.getClient($scope.clientId)
    .then(function(res){
      // console.log('getClient', res);
      $scope.modules = res.data[0].modules;
    });
    // }

    $scope.submitModule = function(){

      var createModule = {
        clientId: this.clientId,
        moduleId: this.moduleId,
        moduleType: this.moduleType
      }

      HomeService.submitModule(createModule)
      .then(function(result){
        // console.log(result);
        HomeService.getClient($scope.clientId)
        .then(function(res){
          // console.log('getClient', res);
          $scope.modules = res.data[0].modules;
        });
      });

    };


    $scope.updateModule = function(){

      var updateModule = {
        clientId: $scope.clientId,
        moduleId: this.module.moduleId,
        moduleType: this.module.moduleType,
        sensorId: this.module.sensorId,
        scaleId: this.module.scaleId,
        moduleNotes: this.module.moduleNotes
      }

      HomeService.updateModule(updateModule)
      .then(function(result){
        HomeService.getClient($scope.clientId)
        .then(function(res){
          $scope.modules = res.data[0].modules;
        });
      });

    }

    $scope.viewModule = function(){
      $state.go('module', {clientId: $scope.clientId, moduleId: this.module.moduleId, moduleObj: this.module});
    }

  }
])

.controller('ModuleController', [
  'HomeService',
  '$stateParams',
  '$state',
  '$scope',
  '$http',
  'moment',
  function(
    HomeService,
    $stateParams,
    $state,
    $scope,
    $http,
    moment
  ){

    $scope.clientId = $stateParams.clientId;
    $scope.moduleId = $stateParams.moduleId;
    $scope.scaleReadings = null;
    $scope.sensorReadings = null;

    HomeService.getModule($scope.clientId, $scope.moduleId)
    .then(function(res){
      $scope.scaleReadings = res.data.scaleReadings;
      $scope.sensorReadings = res.data.sensorReadings;
      $scope.time = moment(res.data.sensorReadings[0].serverParseTime._d).format();
    });

    $scope.getTime = function(){
      return moment(this.reading.serverParseTime._d).format('MM/DD/YY, h:mm');
    }

  }
])
