/**=========================================================
 * Module: representative.js
 * Representative details
 =========================================================*/

myApp.controller('RepresentativeDataController',['$location','$scope','$rootScope', '$log', '$http', 'DataFetcher',
    function($location, $scope, $rootScope, $log, $http, DataFetcher){
    $scope.dados = {};
    $scope.fetchData = function(){
        DataFetcher.fetchDataRepresentative($location.search().id);
    };
    $scope.$on('fetch:completed', function(event) {
        $scope.dados = DataFetcher.getResults();
    });
}]);

myApp.controller('ChartJSController', ["$scope", "$location", "colors", "DataFetcher",
  function($scope, $location, colors,DataFetcher) {

// Pie chart
// -----------------------------------

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

  $scope.fetchThemeData = function(){
        DataFetcher.fetchDataRepresentativeTheme($location.search().id);
  };
  $scope.$on('fetch representativeTheme:completed', function(event) {
      var themes = (DataFetcher.getResults());
      $scope.themeData = themes;
      themes.forEach(function(item){
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

  $scope.fetchThemeData();

}]);

myApp.controller('RepresentativeTermController',['$location','$scope','$rootScope', '$log', '$http', 'DataFetcher',
    function($location, $scope, $rootScope, $log, $http, DataFetcher){
    $scope.terms = {};
    $scope.fetchTermsData = function(){
        DataFetcher.fetchDataTermsRepresentative($location.search().id);
    };
    $scope.$on('fetch representativeTerm:completed', function(event) {
        $scope.terms = DataFetcher.getResults();
    });
    $scope.fetchTermsData();
}]);

myApp.controller('RepresentativeBillsController',['$location','$scope','$rootScope', '$log', '$http', 'DataFetcher',
    function($location, $scope, $rootScope, $log, $http, DataFetcher){
    $scope.billsRepresentative = {};
    $scope.fetchRepresentativesBillData = function(){
        DataFetcher.fetchRepresentativesBillData($location.search().id);
    };

    $scope.$on('fetch representativeBills:completed', function(event) {
        $scope.billsRepresentative = DataFetcher.getResults();
    });

    $scope.fetchRepresentativesBillData();
}]);

myApp.controller('RepresentativeCommitteesController',['$location','$scope','$rootScope', '$log', '$http', 'DataFetcher',
    function($location, $scope, $rootScope, $log, $http, DataFetcher){
    $scope.committeesRepresentative = {};
    $scope.fetchRepresentativesBillData = function(){
        DataFetcher.fetchRepresentativesCommittees($location.search().id);
    };

    $scope.$on('fetch representativeCommittees:completed', function(event) {
        $scope.committeesRepresentative = DataFetcher.getResults();
        console.log($scope.committeesRepresentative);
    });

    $scope.fetchRepresentativesBillData();
}]);



myApp.filter('emailFilter', function() {
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

myApp.filter('ageFilter', function() {
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

myApp.filter('orderObjectBy', function(){
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
