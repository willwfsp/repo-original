/**=========================================================
 * Module: committees.js
 * Legislative Houses controller
 =========================================================*/

 myApp.controller('CommitteesController',
  ['$scope', '$log', '$stateParams','DataFetcher',
    function($scope, $log, $stateParams, DataFetcher){

    DataFetcher.fetchCommitteeDetails($stateParams.house,
        $stateParams.committeeID).then(function(data) {
        $scope.committeesDetails = data[0].data;
        $scope.committeesMembers = data[1].data;

   });
}]);


