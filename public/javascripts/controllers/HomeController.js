
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
      HomeService.submitClient($scope.clientName).then(function(result){

        console.log();
        if (result.data.clientExists) {

          prompt({
            title: 'Access client: ' + $scope.clientName + '?',
            message: 'Are you sure you want to access ' + $scope.clientName + '?'
          }).then(function(){
            //he hit ok and not cancel
            $state.go('client', {clientName: $scope.clientName, clientExists: result.data.clientExists, clientId: result.data.clientId});
          });

        }else{

          prompt({
            title: 'Create client: ' + $scope.clientName + '?',
            message: 'Are you sure you want to create a new client ' + $scope.clientName + '?'
          }).then(function(){
            //he hit ok and not cancel
            $state.go('client', {clientName: $scope.clientName, clientExists: result.data.clientExists, clientId: result.data.clientId});
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
  'prompt',
  function(
    HomeService,
    $stateParams,
    $state,
    $scope,
    $http,
    prompt
  ){

    $scope.clientName = $stateParams.clientName;
    $scope.clientId = $stateParams.clientId;
    $scope.modules = [];
    $scope.moduleTypes = ['Environmental', 'Tote', 'Trimmer', 'Plant'];
    $scope.sensorIds = [21, 23];
    $scope.scaleIds = [22];
    // console.log($stateParams);
    $scope.showDetails = false;

    // if ($stateParams.clientExists) {
    HomeService.getClient({clientId: $scope.clientId, clientName: $scope.clientName})
    .then(function(res){
      // console.log('getClient', res);
      console.log("CONTROLLER MODULES", res);
      $scope.modules = res.data.modules;
    });
    // }

    // $scope.moduleShow = function(){
    //   console.log(this);
    //   $scope.showDetails = !$scope.showDetails;
    // }

    $scope.submitModule = function(){

      var createModule = {
        clientId: parseInt($scope.clientId),
        clientName: $scope.clientName,
        moduleName: this.moduleName,
        moduleType: this.moduleType
      }

      console.log("$$$$CREATE MOD", createModule);

      HomeService.submitModule(createModule)
      .then(function(result){

        console.log("$$$$$$$CTRLR", result);

        if (result.moduleExists) {

          prompt({
            title: 'Error',
            message: 'Module of the same name already exists'
          }).then(function(){
            $state.go('client', {clientName: $scope.clientName, clientId: $scope.clientId});
          });


        }

        HomeService.getClient({clientId: $scope.clientId, clientName: $scope.clientName})
        .then(function(res){
          $scope.modules = res.data.modules;
        });

      });

    };


    $scope.updateModule = function(){

      console.log("THIS", this);

      var updateModule = {
        clientId: parseInt($scope.clientId),
        moduleId: this.$parent.module.module_id,
        sensorId: this.$parent.module.sensor_id,
        scaleId: this.$parent.module.scale_id,
        moduleNotes: this.$parent.module.module_notes
      }

      console.log("UPDATE MODULE OBJ", updateModule);

      HomeService.updateModule(updateModule)
      .then(function(result){
        HomeService.getClient({clientId: $scope.clientId, clientName: $scope.clientName})
        .then(function(res){
          $scope.modules = res.data.modules;
        });
      });

    }

    $scope.viewModule = function(){
      $state.go('module', {clientId: $scope.clientId, moduleId: this.module.moduleId, moduleObj: this.module});
    }

    $scope.syncData = function(){
      var index = this.$parent.$index;
      HomeService.getClient($scope.clientId)
      .then(function(res){
        $scope.modules[index].scaleReadings = res.data[0].modules[index].scaleReadings;
        $scope.modules[index].sensorReadings = res.data[0].modules[index].sensorReadings;
      });
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
