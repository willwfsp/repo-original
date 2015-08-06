
myApp.controller('ProposicaoController', ['$location', '$scope','$state', '$stateParams', '$log', '$http','ngTableParams', 'DataFetcher',
    function($location,$scope, $state, $stateParams, $log, $http, ngTableParams, DataFetcher){
    $scope.dados = {};
    $scope.docs = [];
    $scope.fetchData = function(){
        console.log($stateParams.billName);
        DataFetcher.fetchBillData($stateParams.billName);
    };
    $scope.$on('fetch bill data:completed', function(event) {
        // you could inspect the data to see if what you care about changed, or just update your own scope
        $scope.dados = DataFetcher.getResults();
        $scope.docs = $scope.dados.SLP_DOCUMENTOS;
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

    $scope.docsTableParams = new ngTableParams({
        page: 1,            // show first page
        count: 10           // count per page
    }, {
        total: 10, // length of data
        counts: [],
        getData: function ($defer, params) {
            console.log($scope.docs.length, (params.page() - 1) * params.count(), params.page() * params.count());
            $defer.resolve($scope.docs.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
    });
}]);

myApp.controller('TramitacaoController', ['$location', '$scope','$state', '$stateParams', '$log',  '$http', 'DataFetcher',
    function($location,$scope, $state, $stateParams, $log, $http, DataFetcher){
    $scope.dados = [];
    $scope.fetchData = function(){
        DataFetcher.fetchDataTramitacoes($stateParams.billName);
    };

    $scope.$on('fetch tramitacoes:completed', function(event) {
        // you could inspect the data to see if what you care about changed,
        // or just update your own scope
        $scope.dados = DataFetcher.getTramitacoes();
    });
}]);

myApp.controller('PollController', ['$location', '$scope','$state', '$stateParams', '$log',  '$modal', 'DataFetcher',
    function($location,$scope, $state, $stateParams, $log, $modal, DataFetcher){
    $scope.dados = [];
    $scope.fetchData = function(){
        DataFetcher.fetchDataPolls($stateParams.billName);
    };

    $scope.formattedDate = function(dateStr){
        return dateStr.replace(" ", "T");
    };

    $scope.$on('fetch polls:completed', function(event) {
        // you could inspect the data to see if what you care about changed, or just update your own scope
        $scope.dados = DataFetcher.getPolls();
    });

}]);

myApp.controller('PollDetailsController', ['$scope', 'DataFetcher', '$stateParams',
    function($scope, DataFetcher, $stateParams) {
    
    $scope.pollData = {};

    $scope.dismiss = function() {
        $scope.$dismiss();
    };

    $scope.fetchData = function(){
        DataFetcher.fetchDataPollDetails($stateParams.pollID);
    };

    $scope.$on('fetch poll data:completed', function(event){
        $scope.pollData = DataFetcher.getPollDetails();
        console.log($scope.pollData);
    });

}]);