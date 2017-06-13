thisApp
.factory('HomeService', function($http){

  return {

    submitClient: function(clientId){
      return $http.post('/submit_id', {data: clientId})
      .then(
        function(success){
          console.log("SUBMIT CLIENT SUCCESS", success);
          return success;
        },
        function(error){
          return error;
        }
      );

    },


    getClient: function(clientId){
      return $http.post('/get_client', {data: clientId})
      .then(
        function(success){
          console.log('GET CLIENT SUCCESS1', success);
          return success;
        },
        function(error){
          console.log('GET CLIENT ERROR', error);
          return error;
        }
      );

    },

    submitModule: function(moduleData){
      return $http.post('/create_module', {data: moduleData})
      .then(
        function(success){
          console.log('CREATE MODULE SUCCESS', success);
          return success.data[0];
        },
        function(error){
          console.log('CREATE MODULE ERROR', error);
          return error;
        }
      );

    },

    updateModule: function(moduleData){
      return $http.post('/update_module', {data: moduleData})
      .then(function(success){
        console.log('UPDATE MODULE SUCCESS', success);
        return success.data[0];
      },
      function(error){
        console.log('UPDATE MODULE ERROR', error);
        return error;
      }
    );

  }



}











});
