/**=========================================================
 * Module: signup.js
 * Controller to register in SigaLei app
 =========================================================*/

App.controller('SignupController',
  ['$scope', '$http', '$state', '$log', 'ngDialog', 'Auth',
    function($scope, $http, $state, $log, ngDialog, Auth) {

    // bind here all data from the form
    $scope.account = {};
    // place the message if something goes wrong
    $scope.authMsg = '';
    $scope.showLoading = false;
    $scope.userpassword = '';
    $scope.mask = '(99) 9999-9999?9';
    $scope.register_phone = "";
    $scope.$watch('register_phone', function() {
        try{
            if($scope.register_phone.length === 11)
                $scope.mask =  '(99) ?9-9999-9999';
            else
                $scope.mask = '(99) 9999-9999?9';
        }
        catch(e){

        };
    });

    $scope.register = function() {
        $scope.authMsg = '';
        $scope.authSucMsg = '';

        if($scope.registerForm.$valid) {
            $scope.showLoading = true;
            var user = {};
            user.name = $scope.registerForm.register_username.$modelValue;
            user.firstname = $scope.registerForm.register_firstname.$modelValue;
            user.lastname = $scope.registerForm.register_lastname.$modelValue;
            user.organization = $scope.registerForm.register_organization.$modelValue;
            //user.industry = $scope.registerForm.register_industry.$modelValue;
            if ( $scope.registerForm.register_phone.$modelValue !== ""){
                user.telephone = $scope.registerForm.register_phone.$modelValue ;
            }

            user.email = $scope.registerForm.register_email.$modelValue;
            user.password = $scope.registerForm.register_password.$modelValue;

            Auth.signup(user, function() {
                $scope.authSucMsg = 'Usuário criado. Verifique seu email para completar o cadastro.';
                $scope.showLoading = false;
            },function(err) {
                if (err.error == "postSignup: all fields are necessary."){
                    $scope.authMsg = 'Todos os campos são necessários.';

                }else if(err.error == "postSignup: unavailable user."){
                    $scope.authMsg = "Usuário indisponível.";
                }else if(err.error == "postSignup: unavailable email."){
                    $scope.authMsg = "E-mail indisponível.";
                }else if(err.error == "postSignup: invalid email."){
                    $scope.authMsg = "E-mail ainda não validado.";
                }else if(err.error == "postSignup: user cant have special chars or upper letter."){
                    $scope.authMsg = "Nome de usuário não pode conter caracteres especiais, espaços ou letras maiúsculas.";
                }else {
                    $scope.authMsg = 'Erro interno do servidor. Tente novamente mais tarde.';
                }
                $scope.showLoading = false;
            });

        } else {
            // set as dirty if the user click directly to login so we show the validation messages
            $scope.registerForm.register_username.$dirty = true;
            $scope.registerForm.register_firstname.$dirty = true;
            $scope.registerForm.register_lastname.$dirty = true;
            $scope.registerForm.register_organization.$dirty = true;
            //$scope.registerForm.register_industry.$dirty = true;
            $scope.registerForm.register_email.$dirty = true;
            $scope.registerForm.register_password.$dirty = true;
            $scope.registerForm.register_agreed.$dirty = true;
        }
    };
    $scope.industryOptions = [
      "Acordos Internacionais", "Agricultura", "Agrotóxico", "Alimentício", "Automotivo", "Aviação", "Bancário", "Bebidas", "Bens de consumo", "Biotecnologia", "Comércio", "Comunicação", "Conglomerados empresariais", "Construção", "Consultoria", "Cosmético", "Eletrônicos", "Energia", "Engenharia", "Entretenimento", "Farmacêutico", "Federações e Associações", "Finanças", "Fumo", "Governamental", "Máquinas", "Mineração", "Naval", "Óleo e Gás", "ONGs (Terceiro Setor)", "Químico", "Saúde", "Seguros", "Sindicatos", "Tecnologia", "Telecomunicações", "Transportes", "Tributário", "Outros"
    ];

    $scope.openTerms = function () {
        ngDialog.open({
            template: 'modalDialogTermId',
            className: 'ngdialog-theme-default'
        });
    };

}]);
