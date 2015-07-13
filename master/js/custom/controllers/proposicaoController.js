myApp.controller('proposicaoController', ['$location', '$scope','$state', '$log',  '$http', 'DataFetcher', 
    function($location,$scope, $state, $log, $http, DataFetcher){
	$scope.dados = {};
    $scope.fetchData = function(){
        console.log($location.search().p);
        DataFetcher.fetch_data_proposicao($location.search().p);
    };
    $scope.toDate = function(dateStr){

        var date = dateStr.substr(0, 4) + '-' + dateStr.substr(4, 2) + '-' + dateStr.substr(6, 2) + ' 00:00:00';

        var t = date.split(/[- :]/);

        // Apply each element to the Date function
        var d = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
        var actiondate = new Date(d);

        return actiondate;

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
        $log.log($scope.dados);
    });
}]);
