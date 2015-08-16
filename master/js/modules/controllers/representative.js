/**=========================================================
 * Module: representative.js
 * Representative details
 =========================================================*/

App.controller('RepresentativeDataController',
  ['$scope','$rootScope', '$stateParams', '$log', '$http', 'DataFetcher', 'colors', '$filter', 'ngTableParams', 'Auth',
    function($scope, $rootScope, $stateParams, $log, $http, DataFetcher, colors, $filter, ngTableParams, Auth){
    $scope.dados = {};
    $scope.dados._id = $stateParams.id;
    $scope.pieData =[];
    $scope.themeData = [];
    $scope.billsRepresentative = [];
    $scope.committeesRepresentative = [];

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

    $scope.committeesTableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {SLP_DATA_APRESENTACAO: 'des'}
    }, {
        total: $scope.committeesRepresentative,
        counts: [],
        getData: function($defer, params){

            var filteredData = $scope.committeesRepresentative;
            if (params.filter() ){
                filteredData = $filter('filter')($scope.committeesRepresentative, params.filter());
            }

            var orderedData = params.sorting() ?
                $filter('orderBy')(filteredData, params.orderBy()) :
                filteredData;

            params.total(orderedData.length); // set total for recalc pagination
            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
    });

    $scope.billsTableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {SLP_DATA_APRESENTACAO: 'des'}
    }, {
        total: $scope.billsRepresentative,
        counts: [],
        getData: function($defer, params){

            var filteredData = $scope.billsRepresentative;
            if (params.filter() ){
                filteredData = $filter('filter')($scope.billsRepresentative, params.filter());
            }

            var orderedData = params.sorting() ?
                $filter('orderBy')(filteredData, params.orderBy()) :
                filteredData;

            params.total(orderedData.length); // set total for recalc pagination
            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
    });

    DataFetcher.fetchDataRepresentative($stateParams.id, Auth.user.token).then(function(data) {
        console.log(data);
        $scope.dados = data[0].data;
        $scope.themeData = data[1].data;
        $scope.terms = data[2].data;
        //$scope.billsRepresentative = data[3].data;
        //$scope.committeesRepresentative = data[4].data;

        //insert representative's bills into variable
        for(var i = 0; i < data[3].data.length; i++){
          $scope.billsRepresentative.push(data[3].data[i].doc);
        };
        $scope.billsTableParams.reload();

        //insert committees the representative participate into variable
        for(var i = 0; i < data[4].data.length; i++){
          $scope.committeesRepresentative.push(data[4].data[i].doc);
        };
        $scope.committeesTableParams.reload();

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
        var arr = new Uint8Array(data[5].data);

        var raw = '';
        var i, j, subArray, chunk = 5000;
        for (i = 0, j = arr.length; i < j; i += chunk) {
            subArray = arr.subarray(i, i + chunk);
            raw += String.fromCharCode.apply(null, subArray);
        }

        var b64 = btoa(raw);
        $scope.RepresentativePhoto = b64;


    });
    var headersPhoto = {
            headers: {Authorization: 'Bearer ' + Auth.user.token,
                      responseType: "arraybuffer"}
    };


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
