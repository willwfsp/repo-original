/**=========================================================
 * Module: signup.js
 * Controller to register in SigaLei app
 =========================================================*/

App.controller('SignupController', ['$scope', '$http', '$state', '$log', function($scope, $http, $state, $log) {

    // bind here all data from the form
    $scope.account = {};
    // place the message if something goes wrong
    $scope.authMsg = '';

    $scope.register = function() {
        $scope.authMsg = '';
        $scope.authSucMsg = '';

        if($scope.registerForm.$valid) {
            var user = {}
            user.name = $scope.registerForm.register_username.$modelValue;
            user.firstname = $scope.registerForm.register_firstname.$modelValue;
            user.lastname = $scope.registerForm.register_lastname.$modelValue;
            user.organization = $scope.registerForm.register_organization.$modelValue;
            user.industry = $scope.registerForm.register_industry.$modelValue;
            user.telephone = $scope.registerForm.register_phone.$modelValue;
            user.email = $scope.registerForm.register_email.$modelValue;
            user.password = $scope.registerForm.register_password.$modelValue;

            $http.post('https://sigalei-api.mybluemix.net/v1/accounts/signup', user)
              .then(function(response) {

                if ( response.status == "201" ) {
                    $scope.authSucMsg = 'Usuário Criado. Verifique seu email para completar o cadastro';
                }
            }, function(x) {
              $scope.authMsg = x.data.error.split(":")[1];
            });

        } else {
            // set as dirty if the user click directly to login so we show the validation messages
            $scope.registerForm.register_username.$dirty = true;
            $scope.registerForm.register_firstname.$dirty = true;
            $scope.registerForm.register_lastname.$dirty = true;
            $scope.registerForm.register_organization.$dirty = true;
            $scope.registerForm.register_industry.$dirty = true;
            $scope.registerForm.register_phone.$dirty = true;
            $scope.registerForm.register_email.$dirty = true;
            $scope.registerForm.register_password.$dirty = true;
            $scope.registerForm.register_agreed.$dirty = true;
        }
    };
  $scope.industryOptions = [
      "Acordos Internacionais", "Agricultura", "Agrotóxico", "Alimentício", "Automotivo", "Aviação", "Bancário", "Bebidas", "Bens de consumo", "Biotecnologia", "Comércio", "Comunicação", "Conglomerados empresariais", "Construção", "Consultoria", "Cosmético", "Eletrônicos", "Energia", "Engenharia", "Entretenimento", "Farmacêutico", "Federações e Associações", "Finanças", "Fumo", "Governamental", "Máquinas", "Mineração", "Naval", "Óleo e Gás", "ONGs (Terceiro Setor)", "Outros", "Químico", "Saúde", "Seguros", "Sindicatos", "Tecnologia", "Telecomunicações", "Transportes", "Tributário"
  ]

}]);

App.directive('numberValidation', function(){
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
                var transformedInput = /^\d+$/.test(inputValue);
                if (!transformedInput) {
                    modelCtrl.$setViewValue(inputValue.replace(/[^0-9\.]+/g, ''));
                    modelCtrl.$render();
                }
                return inputValue;
            });
        }
    };
});

App.directive('usernameValidation', function(){
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl) {

            modelCtrl.$parsers.push(function (inputValue) {

                inputValue = inputValue.toLowerCase().replace(/\s+/g,'');
                var transformedInput = /^\d+$/.test(inputValue.slice(-1));

                modelCtrl.$setViewValue(inputValue);
                modelCtrl.$render();
                return inputValue;

            });
        }
    };
});

App.filter('tel', function () {
    return function (tel) {
        if (!tel) { return ''; }

        var value = tel.toString().trim().replace(/^\+/, '');

        if (value.match(/[^0-9]/)) {
            return tel;
        }

        var country, city, number;

        switch (value.length) {
            case 10: // +1PPP####### -> C (PPP) ###-####
                country = 1;
                city = value.slice(0, 3);
                number = value.slice(3);
                break;

            case 11: // +CPPP####### -> CCC (PP) ###-####
                country = value[0];
                city = value.slice(1, 4);
                number = value.slice(4);
                break;

            case 12: // +CCCPP####### -> CCC (PP) ###-####
                country = value.slice(0, 3);
                city = value.slice(3, 5);
                number = value.slice(5);
                break;

            default:
                return tel;
        }

        if (country == 1) {
            country = "";
        }

        number = number.slice(0, 3) + '-' + number.slice(3);

        return (country + " (" + city + ") " + number).trim();
    };
});
