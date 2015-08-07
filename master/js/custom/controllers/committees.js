/**=========================================================
 * Module: committees.js
 * Legislative Houses controller
 =========================================================*/

 myApp.controller('CommitteesController',
  ['$scope', '$log', '$stateParams', '$filter', 'ngTableParams', 'DataFetcher',
    function($scope, $log, $stateParams, $filter, ngTableParams, DataFetcher){

    $scope.committeesMembers = [];

    $scope.membersTableParams = new ngTableParams({
            page: 1,
            count: 10
        }, {
            total: $scope.committeesMembers.length,
            counts: [],
            getData: function($defer, params){
                console.log(params);
                var orderedData = params.sorting() ?
                    $filter('orderBy')($scope.committeesMembers, params.orderBy()) :
                    $scope.committeesMembers;
                $defer.resolve(orderedData);
            }
    });

    DataFetcher.fetchCommitteeDetails($stateParams.house,
        $stateParams.committeeID).then(function(data) {
        $scope.committeesDetails = data[0].data;
        $scope.committeesMembers = data[1].data.rows;
        $scope.membersTableParams.reload();
    });
}]);


