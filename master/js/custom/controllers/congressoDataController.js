myApp.controller('congressoDataController', ['$scope','$rootScope', '$log', '$http', 'DataFetcher', function($scope, $rootScope, $log, $http, DataFetcher){
	$scope.dados = {};
    $scope.fetchData = function(){
        DataFetcher.fetchDataCongresso();
    };
    $scope.$on('fetch:completed', function(event) {
        $scope.dados = DataFetcher.getResults();
    });
}]);

myApp.controller('camaraDataController', ['$scope','$rootScope', '$log', '$http', 'DataFetcher', function($scope, $rootScope, $log, $http, DataFetcher){
    $scope.dados = {};
    $scope.fetchData = function(){
        DataFetcher.fetch_data_camara();
    };
    $scope.$on('fetch:completed', function(event) {
        $scope.dados = DataFetcher.getResults();
    });
}]);

myApp.controller('senadoDataController', ['$scope','$rootScope', '$log', '$http', 'DataFetcher', function($scope, $rootScope, $log, $http, DataFetcher){
    $scope.dados = {};
    $scope.fetchData = function(){
        DataFetcher.fetch_data_senado();
    };
    $scope.$on('fetch:completed', function(event) {
        $scope.dados = DataFetcher.getResults();
    });
}]);