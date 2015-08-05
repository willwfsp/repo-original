
myApp.controller('CongressoDataController', ['$scope','$rootScope', '$log', '$http', 'DataFetcher', function($scope, $rootScope, $log, $http, DataFetcher){
	$scope.dados = {};
    $scope.fetchData = function(){
        DataFetcher.fetchDataCongresso();
    };
    $scope.$on('fetch:completed', function(event) {
        $scope.dados = DataFetcher.getResults();
    });
}]);

myApp.controller('CamaraDataController', ['$scope','$rootScope', '$log', '$http', 'DataFetcher', function($scope, $rootScope, $log, $http, DataFetcher){
    $scope.dados = {};
    $scope.fetchData = function(){
        DataFetcher.fetch_data_camara();
    };
    $scope.$on('fetch:completed', function(event) {
        $scope.dados = DataFetcher.getResults();
    });
}]);

myApp.controller('SenadoDataController', ['$scope','$rootScope', '$log', '$http', 'DataFetcher', function($scope, $rootScope, $log, $http, DataFetcher){
    $scope.dados = {};
    $scope.fetchData = function(){
        DataFetcher.fetch_data_senado();
    };
    $scope.$on('fetch:completed', function(event) {
        $scope.dados = DataFetcher.getResults();
    });
}]);


