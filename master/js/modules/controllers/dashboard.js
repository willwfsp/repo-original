/**=========================================================
 * Module: dashboard.js
 * Dashboard controller
 =========================================================*/

App.controller('DashboardController',
  ['$scope','$state','$rootScope', '$stateParams', '$log', '$http', 'DataFetcher', 'Auth', 'CacheManager',
    function($scope, $state, $rootScope, $stateParams, $log, $http, DataFetcher, Auth, CacheManager){


    $rootScope.$broadcast("event:show-loading");
    $scope.houses = ['CD', 'SF', 'SP', 'MG'];
    $scope.housesNews = [];

    var cacheAllowed = $state.current.data.cache;
    if(cacheAllowed && CacheManager.fetchHousesNews()){
        prepareData(CacheManager.fetchHousesNews());
    }else{
        DataFetcher.fetchHousesNews($scope.houses, Auth.user.token).then(function(data){
            CacheManager.cacheHousesNews(data);
            prepareData(data);
        });
    }

    function prepareData (data){
        $scope.housesNews[0] = data[0].data;
        $scope.housesNews[1] = data[1].data;
        $scope.housesNews[2] = data[2].data;
        $scope.housesNews[3] = data[3].data;

        for(var i = 0; i < 4; i++){
            $scope.housesNews[i].name = $scope.houses[i];
        }
        $rootScope.$broadcast("event:dismiss-loading");
    }
}]);




