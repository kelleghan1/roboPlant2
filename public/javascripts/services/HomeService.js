thisApp
.factory('HomeService', function($http){

  return {

    submitClient: function(clientId){
      return $http.post('/submit_id', {data: clientId})
      .then(
        function(success){
          return success;
        },
        function(error){
          return error;
        }
      );
    },


    submitModule: function(moduleData){
      return $http.post('/create_module', {data: moduleData})
      .then(function(success){
        return success.data[0];
      },
      function(error){
        return error;
      });
    },


    getClient: function(clientId){
      return $http.post('/get_client', {data: clientId})
      .then(function(success){
        return success;
      },
      function(error){
        return error;
      });
    },


    getModule: function(clientId, moduleId){
      return $http.post('/get_module', {clientId: clientId, moduleId: moduleId})
      .then(function(success){
        return success;
      },
      function(error){
        return error;
      });
    },


    updateModule: function(moduleData){
      return $http.post('/update_module', {data: moduleData})
      .then(function(success){
        return success.data[0];
      },
      function(error){
        return error;
      });
    }



  }











});
