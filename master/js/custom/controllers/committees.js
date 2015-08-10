/**=========================================================
 * Module: committees.js
 * Legislative Houses controller
 =========================================================*/

 myApp.controller('CommitteesController',
  ['$scope', '$log', '$stateParams', '$filter', 'ngTableParams', 'DataFetcher',
    function($scope, $log, $stateParams, $filter, ngTableParams, DataFetcher){
    $scope.committeesMembers = [];
    $scope.membersJson = [];

    $scope.membersTableParams = new ngTableParams({
            page: 1,
            count: 10,
            sorting: {name: 'asc'}
        }, {
            total: $scope.membersJson.length,
            counts: [],
            getData: function($defer, params){

                var filteredData = $scope.membersJson;
                if (params.filter() ){
                    orderedData = $filter('filter')($scope.membersJson, params.filter());
                }

                var orderedData = params.sorting() ?
                    $filter('orderBy')(filteredData, params.orderBy()) :
                    filteredData;

                params.total(orderedData.length); // set total for recalc pagination
                console.log(orderedData.length);
                $defer.resolve(orderedData);
            }
    });

    DataFetcher.fetchCommitteeDetails($stateParams.house,
        $stateParams.committeeID).then(function(data) {
        $scope.committeesDetails = data[0].data;
        $scope.committeesMembers = data[1].data.rows;

        for(var i = 0; i < $scope.committeesMembers.length; i++){
            var parsedMember = {};
            parsedMember.name = $scope.committeesMembers[i].key[3];
            parsedMember.position = $scope.committeesMembers[i].key[4];
            parsedMember.situation = $scope.committeesMembers[i].key[5];
            parsedMember.party = $scope.committeesMembers[i].key[6];
            parsedMember.house = $scope.committeesMembers[i].key[0];
            parsedMember.id = $scope.committeesMembers[i].key[8];
            $scope.membersJson.push(parsedMember);
        };
        $scope.membersTableParams.reload();
    });
}]);


