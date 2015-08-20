/**=========================================================
 * Module: recover.js
 * Recover password
 =========================================================*/
App.controller("RecoverPasswordController",
  ["$scope", "$log", '$state', '$http',
    function($scope, $log, $state, $http){

    $scope.showLoading = false;

    $scope.recover = function() {
        $scope.authSucMsg = '';
        $scope.authErrMsg = '';
        if($scope.recoverForm.$valid) {

            $scope.showLoading = true;
            var email = {};
            email.email = $scope.recoverForm.email.$modelValue;
            $http.post('https://sigalei-api.mybluemix.net/v1/accounts/forgot', email)
              .then(function(response) {

                if ( response.status == "200" ) {
                    $scope.authSucMsg = 'Email enviado.';
                    $scope.showLoading = false;
                }
            }, function(x) {
                $scope.showLoading = false;
                $scope.authErrMsg = "E-mail inválido.";
            });

        } else {
            $scope.recoverForm.email.$dirty = true;
        }
    };

}]);
