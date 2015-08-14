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
