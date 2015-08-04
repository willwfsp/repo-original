
myApp.controller('ProposicaoController', ['$location', '$scope','$state', '$log',  '$http', 'DataFetcher',
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
    $scope.coAuthorsCollapsed = true;
    $scope.houseFullName = function(initials){
        switch(initials){
            case 'SF': return "Senado Federal"; break;
            case 'CD': return "Câmara dos Deputados"; break;
            case 'SP': return "São Paulo"; break;
            case 'MG': return "Minas Gerais"; break;
            default:   return "";
        };
    }
}]);

myApp.controller('TramitacaoController', ['$location', '$scope','$state', '$log',  '$http', 'DataFetcher',
    function($location,$scope, $state, $log, $http, DataFetcher){
    $scope.dados = [];
    $scope.fetchData = function(){
        DataFetcher.fetchDataTramitacoes($location.search().p);
    };

    $scope.$on('fetch tramitacoes:completed', function(event) {
        // you could inspect the data to see if what you care about changed,
        // or just update your own scope
        $scope.dados = DataFetcher.getTramitacoes();
    });
}]);

myApp.controller('PollController', ['$location', '$scope','$state', '$log',  '$modal', 'DataFetcher',
    function($location,$scope, $state, $log, $modal, DataFetcher){
    $scope.dados = [];
    $scope.fetchData = function(){
        DataFetcher.fetchDataPolls($location.search().p);
    };

    $scope.formattedDate = function(dateStr){
        return dateStr.replace(" ", "T");
    };

    $scope.$on('fetch polls:completed', function(event) {
        // you could inspect the data to see if what you care about changed, or just update your own scope
        $scope.dados = DataFetcher.getPolls();
    });

}]);

myApp.filter('positiveNumber', function() {
  return function(items, fields) {
        var result = {};
        angular.forEach(items, function(value, key) {
            if (value > 0) {
                result[key] = value;
            }
        });
        return result;
    };
});