App.controller('FavoriteBillsController', ['$scope', '$log', 'DataFetcher', '$filter', '$stateParams', 'Auth',
    function($scope, $log, DataFetcher, $filter, $stateParams, Auth) {
    $scope.folders = ["Saúde", "Startups", "Uber"];
    $scope.bills = ["CD-PL-4330-2004", "SF-PLS-530-2015", "SF-PEC-33-2012"];
    $scope.currentFolder = "";

    $scope.deleteFolder = function(name){
    	var index = $scope.folders.indexOf(name);
    	$scope.folders.splice(index, 1);
    };
    $scope.deleteBill = function(name){
    	var index = $scope.bills.indexOf(name);
    	$scope.bills.splice(index, 1);
    };
}]);