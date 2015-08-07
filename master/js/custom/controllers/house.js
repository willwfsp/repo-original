/**=========================================================
 * Module: house.js
 * Legislative Houses controller
 =========================================================*/

myApp.controller('HouseDataController',
  ['$scope','$rootScope', '$log', '$http', 'DataFetcher',
    function($scope, $rootScope, $log, $http, DataFetcher){


    DataFetcher.fetchDataHouseDetails("CD").then(function(data){
        $scope.houseDetails = data;
    });

}]);




