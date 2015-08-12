/**=========================================================
 * Module: signup.js
 * Confirm registration
 =========================================================*/

App.controller('SignupConfirmController',
  ['$scope', '$http', '$state', '$log', '$state', '$stateParams', '$timeout',
    function($scope, $http, $state, $log, $state, $stateParams, $timeout) {

    var token = $stateParams.token;
    $scope.showLoading = true;

    var re = new RegExp('[0-9a-f]{22}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}', 'i');
    if (!re.test(token)) {
        $scope.authMsg = 'Token Inválido';
        $scope.showLoading = false;
        $scope.showSendAgain = true;
    }else{
        var url = 'https://sigalei-api.mybluemix.net/v1/accounts/signup/' + token;
        $http.get(url)
            .then(function(response) {

                if ( response.status == "200" ) {
                    $scope.authSucMsg = 'Token Validado. Redirecionando...';
                    $scope.showLoading = false;
                    $timeout(function(){$state.go("page.login")}, 3000);
                } else{
                    $scope.authMsg = 'Token Inválido';
                    $scope.showLoading = false;
                    $scope.showSendAgain = true;
                }

            }, function(x) {
                $scope.authMsg = 'Token Inválido';
                $scope.showLoading = false;
                $scope.showSendAgain = true;
            });
    }


}]);
