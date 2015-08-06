/**=========================================================
 * Module: bills.js
 * Bills Details
 =========================================================*/

myApp.controller('BillController',
  ['$location', '$scope','$state', '$stateParams', '$log', '$http',
   'ngTableParams', 'DataFetcher',
    function($location,$scope, $state, $stateParams, $log, $http,
        ngTableParams, DataFetcher){
    var results;
    DataFetcher.fetchBill($stateParams.billName).then(function(data) {
       //this will execute when the
       //AJAX call completes.
       $scope.dados = data[0].data;
       $scope.tracksBill = data[1].data;
       $scope.billVotingList = data[2].data;

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
