/**=========================================================
 * Module: bill.js
 * Bills Details
 =========================================================*/

myApp.controller('BillController',
  ['$location', '$scope','$state', '$stateParams', '$log', '$http',
   'ngTableParams', 'DataFetcher',
    function($location,$scope, $state, $stateParams, $log, $http,
        ngTableParams, DataFetcher){

    DataFetcher.fetchBill($stateParams.billName).then(function(data) {
       $scope.dados = data[0].data;
       $scope.tracksBill = data[1].data;
       $scope.billVotingList = data[2].data;
   });
    $scope.coAuthorsCollapsed = true;

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
