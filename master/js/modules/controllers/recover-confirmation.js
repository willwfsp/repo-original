/**=========================================================
 * Module: recover.js
 * Recover password
 =========================================================*/

 App.controller("RecoverPasswordConfirmController",
  ["$scope", "$log", '$state', '$stateParams', '$http',
    function($scope, $log, $state, $stateParams, $http){

    var token = $stateParams.token;
    $scope.showLoading = true;
    var re = new RegExp('[0-9a-f]{22}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}', 'i');
    if (!re.test(token)) {
        $scope.authErrMsg  = 'Token Inválido';
        $scope.showLoading = false;
    } else{

        var url = 'https://sigalei-api.mybluemix.net/v1/accounts/forgot/' + token;
        $http.get(url)
            .then(function(response) {

                if (response.status == "200" ) {
                    $scope.authSucMsg  = 'Senha Resetada. Veja seu email.';
                    $scope.showLoading = false;
                    $timeout(function(){$state.go("page.login")}, 2000);
                }

            }, function(x) {
                $scope.authErrMsg  = 'Token Inválido. Cheque o seu email para recuperar o token correto.';
                $scope.showLoading = false;

            });
    }
}]);
