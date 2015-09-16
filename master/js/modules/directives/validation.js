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
                modelCtrl.$setViewValue(inputValue);
                modelCtrl.$render();

                var transformedInput = /[a-z0-9]/.test(inputValue.slice(-1));
                if (!transformedInput) {
                    modelCtrl.$setViewValue(inputValue.substring(0, inputValue.length - 1));
                    modelCtrl.$render();
                }


                return inputValue;

            });
        }
    };
});
