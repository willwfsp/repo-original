myApp.controller('congressoDataController', ['$scope','$rootScope', '$log', '$http', 'DataFetcher', function($scope, $rootScope, $log, $http, DataFetcher){
	$scope.dados = {};
    $scope.fetchData = function(){
        DataFetcher.fetch_data_congresso();
    }
    $scope.$on('search:completed', function(event) {
        $scope.dados = DataFetcher.get_results();
    });
    /*
    $scope.fetchData = function(){
        var url = $rootScope.app.databaseURL + 'assembleias/eed505570f32a32977ada84991c73457?access_token=' + $rootScope.app.token;
        var req = {
                url: url,
                dataType: "json, jsonp",
                method: 'GET',
                headers: {
                    'Access-Control-Allow-Origin' : '*',
                    'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }              
        };
        $http(req)
            .success(function(data){
            	$scope.dados = data;
            })
            .error(function(data){
            	$log.log("Error");
            });

    };
    */
}]);