myApp.controller('proposicaoController', ['$location', '$scope','$state', '$log',  '$http', 'DataFetcher', 
    function($location,$scope, $state, $log, $http, DataFetcher){
	$scope.dados = {};
    $scope.fetchData = function(){
        console.log($location.search().p);
        DataFetcher.fetch_data_proposicao($location.search().p);
    };
    $scope.$on('fetch:completed', function(event) {
        // you could inspect the data to see if what you care about changed, or just update your own scope
        $scope.dados = DataFetcher.getResults();
    });

}]);

myApp.controller('tramitacaoController', ['$location', '$scope','$state', '$log',  '$http', 'DataFetcher', 
    function($location,$scope, $state, $log, $http, DataFetcher){
    $scope.dados = [];
    $scope.fetchData = function(){
        DataFetcher.fetchDataTramitacoes($location.search().p);
    };

    $scope.$on('fetch tramitacoes:completed', function(event) {
        // you could inspect the data to see if what you care about changed, or just update your own scope
        $scope.dados = DataFetcher.getTramitacoes();
    });
}]);

myApp.controller('pollController', ['$location', '$scope','$state', '$log',  '$http', 'DataFetcher', 
    function($location,$scope, $state, $log, $http, DataFetcher){
    $scope.dados = [];
    $scope.fetchData = function(){
        DataFetcher.fetchDataPolls($location.search().p);
    };
    $scope.formattedDate = function(dateStr){
        return dateStr.replace(" ", "T");
    }
    $scope.$on('fetch polls:completed', function(event) {
        // you could inspect the data to see if what you care about changed, or just update your own scope
        $scope.dados = DataFetcher.getPolls();
    });
}]);
