App.controller('ViewDocumentsController', ['$scope', '$log', 'DataFetcher', '$stateParams', 'Auth','$rootScope',
    function($scope, $log, DataFetcher, $stateParams, Auth, $rootScope) {

    $rootScope.$broadcast("event:show-loading");

    DataFetcher.fetchBillDoc($stateParams.docUrl, Auth.user.token).then(function(data) {
        $scope.docContent = data[0].data.texto;
        $scope.billName = data[0].data.proposicao;

        $rootScope.$broadcast("event:dismiss-loading");
    });
}]);
