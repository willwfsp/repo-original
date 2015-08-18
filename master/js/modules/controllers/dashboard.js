/**=========================================================
 * Module: dashboard.js
 * Dashboard controller
 =========================================================*/

App.controller('DashboardController',
  ['$scope','$rootScope', '$stateParams', '$log', '$http', 'DataFetcher', 'Auth',
    function($scope, $rootScope, $stateParams, $log, $http, DataFetcher, Auth){

    $scope.houses = ['CD', 'SF', 'SP', 'MG'];
    $scope.housesNews = new Array();

    DataFetcher.fetchHousesNews($scope.houses, Auth.user.token).then(function(data){
        $scope.housesNews[0] =        data[0].data;
        $scope.housesNews[1] =        data[1].data;
        $scope.housesNews[2] =        data[2].data;
        $scope.housesNews[3] =        data[3].data;

        for(var i = 0; i < 4; i++){
            $scope.housesNews[i].name = $scope.houses[i];
        }
        $log.log($scope.housesNews);
    });
}]);




