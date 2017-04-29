thisApp
.factory('HomeService', function($http){
  console.log('SERVICE');


  return {

    submitClient: function(clientId){
      console.log('CHECK');
      return $http.post('/submit_id', {data: clientId})
      .then(
        function(success){
          console.log('success1', success);
          return success.data[0];
        },
        function(error){
          console.log('error1', error);
          return error;
        }
      );

    }

  }











});
