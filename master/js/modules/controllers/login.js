/**=========================================================
 * Module: access-login.js
 * Demo for login api
 =========================================================*/

App.controller('LoginFormController',
  ['$scope', '$http', '$state', 'Auth',
    function($scope, $http, $state, Auth) {

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

            Auth.login({login: $scope.loginUser, password: $scope.account.password},
              function() {

                $state.go("app.dashBoard");
            },function(err) {

                if (err.error == "postLogin: Invalid user or password"){
                    $scope.authMsg = 'Usuário/Email ou senha incorretos.';

                } else if (err.error == "postLogin: Email unverified"){
                    $scope.authInfoMsg = 'Conta não validada. Valide seu email antes de entrar.';
                    $scope.showFooter = true;

                } else if (err.error == "postLogin: The account is temporarily locked"){
                    $scope.authMsg = 'Conta temporiarimento bloqueada por 20 minutos.';

                } else if (err.error == "postLogin: Your account will be locked soon"){
                    $scope.authMsg = 'Você possue somente mais duas tentativas antes do bloqueio da conta.';

                } else {
                    $scope.authMsg = 'Erro Interno do Servidor. Tente novamente mais tarde.';
                }
                $scope.showLoading = false;
            });


        }
        else {
          // set as dirty if the user click directly to login so we show the validation messages
          $scope.loginForm.account_login.$dirty = true;
          $scope.loginForm.account_password.$dirty = true;
        }
    };

}]);
