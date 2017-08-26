
thisApp
.controller('HomeController', [
  'HomeService',
  '$stateParams',
  '$state',
  '$scope',
  '$rootScope',
  '$http',
  'prompt',
  function(
    HomeService,
    $stateParams,
    $state,
    $scope,
    $rootScope,
    $http,
    prompt
  ){

    $rootScope.loading = false;

    $scope.submitClient = function(){
      $rootScope.loading = true;

      HomeService.submitClient($scope.clientName).then(function(result){

        $rootScope.loading = false;

        if (result.data.clientExists) {

          prompt({
            title: 'Access Client: ' + $scope.clientName + '?',
            message: 'Are you sure you want to access ' + $scope.clientName + '?'
          }).then(function(){
            //he hit ok and not cancel
            $state.go('client', {clientName: $scope.clientName, clientExists: result.data.clientExists, clientId: result.data.clientId});
          });

        }else{

          prompt({
            title: 'Create Client: ' + $scope.clientName + '?',
            message: 'Are you sure you want to create a new client ' + $scope.clientName + '?'
          }).then(function(){
            //he hit ok and not cancel
            $state.go('client', {clientName: $scope.clientName, clientExists: result.data.clientExists, clientId: result.data.clientId});
          });

        }
      })
    };

    var socket = io.connect('http://192.168.0.106:4200');
    socket.on('connect', function(data) {
      socket.emit('join', 'Hello World from client');
    });

    socket.on('messages', function(data) {
      console.log(data);
    });

  }

])

.controller('ClientController', [
  'HomeService',
  '$stateParams',
  '$state',
  '$scope',
  '$rootScope',
  '$http',
  'prompt',
  function(
    HomeService,
    $stateParams,
    $state,
    $scope,
    $rootScope,
    $http,
    prompt
  ){

    $scope.clientName = $stateParams.clientName;
    $scope.clientId = $stateParams.clientId;
    $scope.modules = [];
    $scope.moduleTypes = ['Environmental', 'Tote', 'Trimmer', 'Plant'];
    $scope.sensorIds = [21, 23];
    $scope.scaleIds = [22];
    $scope.showDetails = false;
    $rootScope.loading = true;
    $scope.characterCount = false;


    HomeService.getClient({clientId: $scope.clientId, clientName: $scope.clientName})
    .then(function(res){

      $rootScope.loading = false;
      console.log("CONTROLLER MODULES", res);
      $scope.modules = res.data.modules;

    });

    $scope.submitModule = function(){

      $rootScope.loading = true;

      var createModule = {
        clientId: parseInt($scope.clientId),
        clientName: $scope.clientName,
        moduleName: this.user.moduleName,
        moduleType: this.user.moduleType
      }

      HomeService.submitModule(createModule)
      .then(function(result){

        if (result.moduleExists) {

          prompt({
            title: 'Error',
            message: 'Module of the same name already exists',
            buttons: [{ label:'OK', primary: true }]
          }).then(function(){
            $state.go('client', {clientName: $scope.clientName, clientId: $scope.clientId});
          });

        }

        HomeService.getClient({clientId: $scope.clientId, clientName: $scope.clientName})
        .then(function(res){
          $rootScope.loading = false;
          $scope.modules = res.data.modules;
        });

        $scope.user = {
          moduleName: '',
          moduleType: ''
        }

      });

    };

    $scope.submitWorker = function(){

      $rootScope.loading = true;

      var createWorker = {
        clientId: parseInt($scope.clientId),
        workerName: this.worker.workerName,
      }

      HomeService.submitWorker(createWorker)
      .then(function(result){

        HomeService.getClient({clientId: $scope.clientId, clientName: $scope.clientName})
        .then(function(res){
          $rootScope.loading = false;
          $scope.modules = res.data.modules;
        });

        $scope.worker = {
          workerName: '',
        }

      });

    };

    $scope.deleteModule = function(){

      console.log("THIS", this);

      $rootScope.loading = true;

      var deleteObj = {
        moduleId: this.$parent.module.module_id,
        clientId: this.$parent.module.client_id,
        scaleId: this.$parent.module.scale_id,
        sensorId: this.$parent.module.sensor_id
      };

      prompt({
        title: 'Delete Module: ' + this.$parent.module.module_name + '?',
        message: 'Are you sure you want to delete ' + this.$parent.module.module_name + '?'
      }).then(function(){
        //he hit ok and not cancel

        console.log("CTRL DEL", deleteObj);

        HomeService.deleteModule(deleteObj)
        .then(function(res){

          HomeService.getClient({clientId: $scope.clientId, clientName: $scope.clientName})
          .then(function(res){
            $scope.modules = res.data.modules;
            $rootScope.loading = false;
          });

        });

      });

    };

    $scope.updateModule = function(){

      $rootScope.loading = true;

      var updateModule = {
        clientId: parseInt($scope.clientId),
        moduleId: this.$parent.module.module_id,
        sensorId: this.$parent.module.sensor_id,
        scaleId: this.$parent.module.scale_id,
        moduleNotes: this.$parent.module.module_notes
      }

      console.log("this", this);

      HomeService.updateModule(updateModule)
      .then(function(result){

        HomeService.getClient({clientId: $scope.clientId, clientName: $scope.clientName})
        .then(function(res){

          $scope.modules = res.data.modules;

          $rootScope.loading = false;

        });

      });

    }

    $scope.viewModule = function(){
      console.log("this", this);
      $state.go('module', {clientName: $scope.clientName, moduleName: this.$parent.module.module_name, clientId: $scope.clientId, moduleId: this.$parent.module.module_id , moduleObj: this.$parent.module});
    }

    $scope.syncData = function(){
      var index = this.$parent.$index;

      HomeService.getClient($scope.clientId)
      .then(function(res){

        $scope.modules[index].scaleReadings = res.data[0].modules[index].scaleReadings;
        $scope.modules[index].sensorReadings = res.data[0].modules[index].sensorReadings;

      });

    }

    var socket = io.connect('http://192.168.0.106:4200');
    socket.on('connect', function(data) {
      socket.emit('join', '###########CLIENT CONNECTED');
    });

    socket.on('weight', function(data) {

      // console.log("SOCKET WEIGHT", data);

      if (data.clientId == $scope.clientId && $scope.modules.length > 0) {

        for (item in $scope.modules){

          if ($scope.modules[item].module_id == data.moduleId) {

            $scope.$apply(function() {
              $scope.modules[item].weight_reading = data.weight;
            });

          }

        }

      }

    });

    socket.on('humidity', function(data) {

      if (data.clientId == $scope.clientId && $scope.modules.length > 0) {

        for (item in $scope.modules){

          if ($scope.modules[item].module_id == data.moduleId) {

            $scope.$apply(function() {
              $scope.modules[item].humidity_reading = data.humidity;
            });

          }

        }

      }

    });

    socket.on('temperature', function(data) {

      if (data.clientId == $scope.clientId && $scope.modules.length > 0) {

        for (item in $scope.modules){

          if ($scope.modules[item].module_id == data.moduleId) {

            $scope.$apply(function() {
              $scope.modules[item].temperature_reading = data.temperature;
            });

          }

        }

      }

    });

  }
])

.controller('ModuleController', [
  'HomeService',
  '$stateParams',
  '$state',
  '$scope',
  '$rootScope',
  '$http',
  'moment',
  function(
    HomeService,
    $stateParams,
    $state,
    $scope,
    $rootScope,
    $http,
    moment
  ){

    $scope.clientName = $stateParams.clientName;
    $scope.moduleName = $stateParams.moduleName;
    $scope.clientId = $stateParams.clientId;
    $scope.moduleId = $stateParams.moduleId;
    $scope.moduleObj = $stateParams.moduleObj;
    $scope.humidityReadings = null;
    $scope.temperatureReadings = null;
    $scope.weightReadings = null;
    $scope.compReadings = [];

    $rootScope.loading = true;

    HomeService.getModule($scope.clientId, $scope.moduleId)
    .then(function(res){

      $scope.humidityReadings = res.data.humidityReadings;
      $scope.temperatureReadings = res.data.temperatureReadings;
      $scope.weightReadings = res.data.weightReadings;

      $rootScope.loading = false;

      (function(){

        for (var i = 0; i < $scope.temperatureReadings.length; i++) {

          var readingObj = {};

          readingObj.time = moment($scope.temperatureReadings[i].time).format('MM/DD/YY, h:mm');
          readingObj.temp = $scope.temperatureReadings[i].temperature_reading;

          for (var ii = 0; ii < $scope.humidityReadings.length; ii++) {
            if ( moment($scope.humidityReadings[ii].time).format('MM/DD/YY, h:mm') == moment($scope.temperatureReadings[i].time).format('MM/DD/YY, h:mm') ) {
              readingObj.hum = $scope.humidityReadings[ii].humidity_reading;
            }
          }

          for (var iii = 0; iii < $scope.weightReadings.length; iii++) {
            if ( moment($scope.weightReadings[iii].time).format('MM/DD/YY, h:mm') == moment($scope.temperatureReadings[i].time).format('MM/DD/YY, h:mm') ) {
              readingObj.weight = $scope.weightReadings[iii].weight_reading;
            }
          }

          $scope.compReadings.push(readingObj);

        }

      })();

    });

    $scope.returnClient = function(){
      $state.go('client', {clientName: $scope.clientName, clientId: $scope.clientId});
    }


    $scope.getTime = function(){

      if (this.reading.time) {
        return moment(this.reading.time).format('MM/DD/YY, h:mm');
      }

    }

  }
])
