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