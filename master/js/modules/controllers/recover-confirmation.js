/**=========================================================
 * Module: recover.js
 * Recover password
 =========================================================*/

 App.controller("RecoverPasswordConfirmController",
  ["$scope", "$log", '$state', '$stateParams', '$http', '$rootScope',
    function($scope, $log, $state, $stateParams, $http, $rootScope){

    var token = $stateParams.token;
    $scope.showLoading = true;
    var re = new RegExp('[0-9a-f]{22}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}', 'i');
    if (!re.test(token)) {
        $scope.authErrMsg  = 'Token Inválido';
        $scope.showLoading = false;
    } else{
        var url = $rootScope.apiURL + 'v1/accounts/forgot/' + token;
        $http.get(url)
            .then(function(response) {

                if (response.status == "200" ) {
                    $scope.authSucMsg  = 'A nova senha foi enviada para o seu email.';
                    $scope.showLoading = false;

                }

            }, function(err) {
                $scope.authErrMsg  = 'Token Inválido. Cheque o seu email para recuperar o token correto ou reenvie um novo token.';
                $scope.showLoading = false;

            });
    }
}]);
