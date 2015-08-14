/**=========================================================
 * Module: access-login.js
 * Demo for login api
 =========================================================*/

App.controller('LoginFormController', ['$scope', '$http', '$state', function($scope, $http, $state) {

  // bind here all data from the form
  $scope.account = {};
  // place the message if something goes wrong
  $scope.authMsg = '';
  $scope.authInfoMsg = '';
  $scope.showFooter = false;
  $scope.showLoading = false;
  $scope.login = function() {
    $scope.authMsg = '';
    $scope.authInfoMsg = '';

    if($scope.loginForm.$valid) {
      $scope.showLoading = true;
      $http
        .post('https://sigalei-api.mybluemix.net/v1/accounts/login',
              {login: $scope.loginUser, password: $scope.account.password})
        .then(function(response) {
            $scope.showLoading = false;
            // assumes if ok, response is an object with some data, if not, a string with error
            // customize according to your api
            alert(response);
        }, function(x) {
            $scope.showLoading = false;
            if (x.status == 500){
                $scope.authMsg = 'Erro Interno do Servidor. Tente novamente mais tarde.';

            } else if (x.data.error == "postLogin: Invalid user or password"){
                $scope.authMsg = 'Usuário/Email ou senha incorretos.';

            } else if (x.data.error == "postLogin: Email unverified"){
                $scope.authInfoMsg = 'Conta não validada. Valide seu email antes de entrar.';
                $scope.showFooter = true;

            } else if (x.data.error == "postLogin: The account is temporarily locked"){
                $scope.authMsg = 'Conta temporiarimento bloqueada por 20 minutos.';

            } else if (x.data.error == "postLogin: Your account will be locked soon"){
                $scope.authMsg = 'Conta temporiarimento bloqueada por 20 minutos.';

            } else {
                $scope.authMsg = x.data.error;
            }



        });
    }
    else {
      // set as dirty if the user click directly to login so we show the validation messages
      $scope.loginForm.account_login.$dirty = true;
      $scope.loginForm.account_password.$dirty = true;
    }
  };

}]);
