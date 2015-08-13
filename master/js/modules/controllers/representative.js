/**=========================================================
 * Module: representative.js
 * Representative details
 =========================================================*/

App.controller('RepresentativeDataController',
  ['$scope','$rootScope', '$stateParams', '$log', '$http', 'DataFetcher', "colors",
    function($scope, $rootScope, $stateParams, $log, $http, DataFetcher, colors){
    $scope.dados = {};
    $scope.dados._id = $stateParams.id;
    $scope.pieData =[];
    $scope.themeData = [];

    $scope.pieOptions = {
        segmentShowStroke : true,
        segmentStrokeColor : '#fff',
        segmentStrokeWidth : 2,
        percentageInnerCutout : 0, // Setting this to zero convert a doughnut into a Pie
        animationSteps : 100,
        animationEasing : 'easeOutBounce',
        animateRotate : true,
        animateScale : false
    };

    DataFetcher.fetchDataRepresentative($stateParams.id).then(function(data) {
        console.log(data)
        $scope.dados = data[0].data;
        $scope.themeData = data[1].data;
        $scope.terms = data[2].data;
        $scope.billsRepresentative = data[3].data;
        $scope.committeesRepresentative = data[4].data;

        $scope.themeData.forEach(function(item){
            var colorAux = colors.byName('random');
            var aux = {
                value: item.value,
                color: colorAux,
                highlight: colorAux,
                label: item.key
            };
            $scope.pieData.push(aux);
        });
    });

}]);

App.filter('emailFilter', function() {
    return function(input, all) {
        var inputAux = "";
        if(input){
          if(input.constructor === Array){
              input.forEach(function(name){
                  inputAux = inputAux + ' , ' + name;
              });
              return inputAux.substring(3);
          }else{
              return input;
          }
        }
    };
  }
);

App.filter('ageFilter', function() {
     function calculateAge(birthdayString) { // birthday is a date
         birthday = new Date(birthdayString);
         var ageDifMs = Date.now() - birthday.getTime();
         var ageDate = new Date(ageDifMs); // miliseconds from epoch
         return Math.abs(ageDate.getUTCFullYear() - 1970);
     }

     return function(birthdate) {
           return calculateAge(birthdate);
     };
});

App.filter('statusDesc', function() {
    return function(input, attribute) {
        return input[attribute].DESC;
    }
});


App.filter('orderObjectBy', function(){
 return function(input, attribute) {
    if (!angular.isObject(input)) return input;

    var array = [];
    for(var objectKey in input) {
        array.push(input[objectKey]);
    }

    array.sort(function(a, b){
        a = parseInt(a[attribute]);
        b = parseInt(b[attribute]);
        return b - a;
    });
    return array;
 }
});
