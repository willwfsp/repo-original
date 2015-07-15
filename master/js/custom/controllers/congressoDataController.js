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

myApp.controller('RepresentativeDataController', ['$location','$scope','$rootScope', '$log', '$http', 'DataFetcher', 
    function($location, $scope, $rootScope, $log, $http, DataFetcher){
    $scope.dados = {};
    $http.get("http://sigalei-api.mybluemix.net/v1/parlamentares/9cb02d1fe70f1097b7932f4b7c4715b1/foto?access_token=admin%40sigalei")
        .success(function (response) {$scope.photo = response;});
    });
    $scope.fetchData = function(){
        DataFetcher.fetchDataRepresentative($location.search().id);
        $scope.photo = 
    };
    $scope.$on('fetch:completed', function(event) {
        $scope.dados = DataFetcher.getResults();
    });
}]);