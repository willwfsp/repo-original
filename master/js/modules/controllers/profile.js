/**=========================================================
 * Module: profile.js
 *
 =========================================================*/

 App.controller('ProfileController', ['$q', '$rootScope', '$scope', '$log', 'Auth', 'DataFetcher', function($q, $rootScope, $scope, $log, Auth, DataFetcher){

    $rootScope.$broadcast("event:show-loading");

    DataFetcher.fetchUserDetails(Auth.user.token).then(function(data) {
        $scope.user = data[0].data;
        $rootScope.$broadcast("event:hide-loading");
    });
}]);
