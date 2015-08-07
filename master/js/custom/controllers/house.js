/**=========================================================
 * Module: house.js
 * Legislative Houses controller
 =========================================================*/

myApp.controller('HouseDataController',
  ['$scope','$rootScope', '$stateParams', '$log', '$http', 'DataFetcher',
    function($scope, $rootScope, $stateParams, $log, $http, DataFetcher){


    DataFetcher.fetchDataHouseDetails($stateParams.house).then(function(data){
        $log.log("houseDetails");
        $scope.houseDetails = data[0].data;
        $scope.houseEvents = data[1].data;
        $scope.houseCommittees = data[2].data;
    });

}]);




