thisApp
.factory('HomeService', function($http){

  return {

    submitClient: function(clientId){
      return $http.post('/submit_id', {data: clientId})
      .then(
        function(success){
          console.log(success);
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
        console.log("SUBMIT MOD SUCCESS", success);
        return success.data;
      },
      function(error){
        console.log("SUBMIT MOD ERROR", error);
        return error;
      });
    },


    deleteModule: function(moduleData){
      return $http.post('/delete_module', moduleData)
      .then(function(success){
        console.log("DELETE MOD SUCCESS", success);
        return success.data;
      },
      function(error){
        console.log("DELETE MOD ERROR", error);
        return error;
      });
    },


    getClient: function(clientId){
      return $http.post('/get_client', {data: clientId})
      .then(function(success){
        console.log("GET CLIENT SUCCESS", success);
        return success;
      },
      function(error){
        console.log(error);
        return error;
      });
    },


    getModule: function(clientId, moduleId){
      return $http.post('/get_module', {clientId: clientId, moduleId: moduleId})
      .then(function(success){
        console.log("GET MODULE SUCCESS", success);
        return success;
      },
      function(error){
        return error;
      });
    },


    updateModule: function(moduleData){
      return $http.post('/update_module', moduleData)
      .then(function(success){
        console.log("UPDATE SUCCESS", success);
        return success.data[0];
      },
      function(error){
        console.log(error);
        return error;
      });
    }



  }











});
