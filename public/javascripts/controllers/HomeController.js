
thisApp
.controller('HomeController', [
  'HomeService',
  '$stateParams',
  '$state',
  '$scope',
  '$http',
  'prompt',
  function(
    HomeService,
    $stateParams,
    $state,
    $scope,
    $http,
    prompt
  ){

    $scope.submitClient = function(){
      HomeService.submitClient($scope.clientId).then(function(result){
        if (result.data.clientExists) {

          prompt({
            title: 'Access client: ' + $scope.clientId + '?',
            message: 'Are you sure you want to access ' + $scope.clientId + '?'
          }).then(function(){
            //he hit ok and not cancel
            $state.go('client', {clientId: $scope.clientId, clientExists: result.data.clientExists});
          });

        }else{

          prompt({
            title: 'Create client: ' + $scope.clientId + '?',
            message: 'Are you sure you want to create a new client ' + $scope.clientId + '?'
          }).then(function(){
            //he hit ok and not cancel
            $state.go('client', {clientId: $scope.clientId, clientExists: result.data.clientExists});
          });

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

    $scope.moduleShow = function(){
      console.log(this);
      // console.log(this.$$nextSibling);
    }

    $scope.submitModule = function(){

      var createModule = {
        clientId: this.clientId,
        moduleId: this.moduleId,
        moduleType: this.moduleType
      }

      HomeService.submitModule(createModule)
      .then(function(result){
        HomeService.getClient($scope.clientId)
        .then(function(res){
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
    });

    $scope.getTime = function(){
      if (this.reading.serverParseTime._d) {
        return moment(this.reading.serverParseTime._d).format('MM/DD/YY, h:mm');
      }
    }

  }
])
