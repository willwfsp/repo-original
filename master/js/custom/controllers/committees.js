/**=========================================================
 * Module: committees.js
 * Legislative Houses controller
 =========================================================*/

 myApp.controller('CommitteesController',
  ['$scope', '$log', '$stateParams','DataFetcher',
    function($scope, $log, $stateParams, DataFetcher){

    $log.log($stateParams.house);
    $log.log($stateParams.committeeID);

}]);

myApp.controller("CommitteesMembersController",
  ["$scope", "$log",
    function($scope, $log){

    $log.log("Example Controller");

}]);


