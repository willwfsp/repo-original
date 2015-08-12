/**=========================================================
 * Module: bill.js
 * Bills Details
 =========================================================*/

myApp.controller('BillController',
  ['$location', '$scope','$state', '$stateParams', '$log', '$http', '$filter',
   'ngTableParams', 'DataFetcher',
    function($location,$scope, $state, $stateParams, $log, $http, $filter,
        ngTableParams, DataFetcher){

    $scope.coAuthorsCollapsed = true;
    $scope.dados = {};
    $scope.docsTableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {SLD_DATA: 'des'}
    }, {
        total: $scope.dados.SLP_DOCUMENTOS,
        counts: [],
        getData: function($defer, params){

            var filteredData = $scope.dados.SLP_DOCUMENTOS;
            if (params.filter() ){
                filteredData = $filter('filter')($scope.dados.SLP_DOCUMENTOS, params.filter());
            }

            var orderedData = params.sorting() ?
                $filter('orderBy')(filteredData, params.orderBy()) :
                filteredData;

            params.total(orderedData.length); // set total for recalc pagination
            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
    });

    DataFetcher.fetchBill($stateParams.billName).then(function(data) {
       $scope.dados = data[0].data;
       $scope.tracksBill = data[1].data;
       $scope.billVotingList = data[2].data;
       $scope.docsTableParams.reload();
   });
}]);

myApp.controller('PollDetailsController', ['$scope', '$log', 'DataFetcher', '$filter', '$stateParams', 'ngTableParams',
    function($scope, $log, DataFetcher, $filter, $stateParams, ngTableParams) {

    $scope.pollData = {};
    $scope.pollResults = [];
    $scope.dismiss = function() {
        $scope.$dismiss();
    };
    $scope.pollTableParams = new ngTableParams({
            page: 1,
            count: 10,
            sorting: {PARLAMENTAR_NOME: 'asc'}
        }, {
            total: $scope.pollResults.length,
            counts: [],
            getData: function($defer, params){

                var filteredData = $scope.pollResults;
                if (params.filter() ){
                    filteredData = $filter('filter')($scope.pollResults, params.filter());
                }

                var orderedData = params.sorting() ?
                    $filter('orderBy')(filteredData, params.orderBy()) :
                    filteredData;

                params.total(orderedData.length); // set total for recalc pagination
                $defer.resolve(orderedData);
            }
    });

    $scope.fetchData = function(){
        DataFetcher.fetchDataPollDetails($stateParams.pollID).then(function(data) {
            $scope.pollData = data;
            $scope.pollResults = data.SLV_VOTOS;
            $scope.pollTableParams.reload();
        });
    };
}]);

myApp.filter('houseFullName', function() {
    return function(input, all) {
        switch(input){
            case "CD": return "Câmara dos Deputados";   break;
            case "SF": return "Senado Federal";         break;
            case "MG": return "Minas Gerais";           break;
            case "SP": return "ALESP";                  break;
            default: return "";
        }
        return ; 
    }
});