App.controller('ProfileController', 
  ['$q','$scope', '$log', 'Auth', 'DataFetcher',
    function($q, $scope, $log, Auth, DataFetcher){

    DataFetcher.fetchUserDetails(Auth.user.token).then(function(data) {
        $scope.user = data[0].data;
    });
}]);