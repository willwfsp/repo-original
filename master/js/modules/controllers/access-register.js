/**=========================================================
 * Module: access-register.js
 * Demo for register account api
 =========================================================*/

App.controller('RegisterFormController', ['$scope', '$http', '$state', function($scope, $http, $state) {

  // bind here all data from the form
  $scope.account = {};
  // place the message if something goes wrong
  $scope.authMsg = '';
  $scope.username = "";
  $scope.$watch('username', function() {
      if($scope.username){
          $scope.username = $scope.username.toLowerCase().replace(/\s+/g,'');
      }
  });

  $scope.register = function() {
    $scope.authMsg = '';

    if($scope.registerForm.$valid) {

      $http
        .post('http://localhost:6005/rest/signup', {name: $scope.username, email: $scope.email, password: $scope.password})
        .then(function(response) {
          // assumes if ok, response is an object with some data, if not, a string with error
          // customize according to your api
          if ( response.status == "204" ) {
            $state.go('app.dashBoard');
          }
        }, function(x) {
          $scope.authMsg = 'Server Request Error';
        });
    }
    else {
      // set as dirty if the user click directly to login so we show the validation messages
      $scope.registerForm.account_email.$dirty = true;
      $scope.registerForm.account_password.$dirty = true;
      $scope.registerForm.account_agreed.$dirty = true;

    }
  };

}]);
