/**=========================================================
 * Module: signup.js
 * Confirm registration
 =========================================================*/

App.controller('SignupConfirmController',
  ['$scope', '$http', '$log', '$state', '$stateParams', '$timeout', 'ngDialog',
    function($scope, $http, $log, $state, $stateParams, $timeout, ngDialog) {

    var token = $stateParams.token;
    $scope.showLoading = true;
    $scope.openConfirm = function () {
        ngDialog.openConfirm({
            template: 'modalDialogId',
            className: 'ngdialog-theme-default'
        }).then(function (value) {
            $scope.authErrMsg = "";
            $scope.authInfoMsg = "";
            $scope.authSucMsg = "";
            $scope.showLoading = true;
            var email = {};
            email.email = value;
            var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
            if(re.test(email.email)){
                $http.post('https://sigalei-api.mybluemix.net/v1/accounts/signup/resend', email)
                    .then(function(response) {

                        if ( response.status == "200" ) {
                            $scope.authInfoMsg = 'Email Re-enviado. Cheque sua caixa de entrada.';
                        }
                        $scope.showLoading = false;
                    }, function(x) {
                        if( x.data.error == "email: already valid"){
                            $scope.authSucMsg = "E-mail já validado.";
                            $timeout(function(){
                                $state.go("page.login");
                            }, 2000);


                        }else{
                            $scope.authErrMsg = "E-mail Inválido.";
                            $scope.authInfoMsg = "";
                        }
                        $scope.showLoading = false;

                    });
            }else {
                $scope.authErrMsg = "E-mail Inválido.";
                $scope.showLoading = false;
            }



        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    };
    var re = new RegExp('[0-9a-f]{22}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}', 'i');
    if (!re.test(token)) {
        if (token !== "resend"){
            $scope.authErrMsg  = 'Token Inválido';
            $scope.showSendAgain = true;

        }else{
            $scope.openConfirm();
        }
        $scope.showLoading = false;
    } else{
        var url = 'https://sigalei-api.mybluemix.net/v1/accounts/signup/' + token;
        $http.get(url)
            .then(function(response) {

                if ( response.status == "200" ) {
                    $scope.authSucMsg = 'Email Validado! Redirecionando...';
                    $scope.showLoading = false;
                    $timeout(function(){
                        $state.go("page.login");
                    }, 2000);
                }

            }, function(x) {
                $scope.authErrMsg  = 'Token Inválido. Cheque o seu email para recuperar o token correto.';
                $scope.showLoading = false;
                $scope.showSendAgain = true;
            }
        );
    }
}]);
