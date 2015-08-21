App.controller('ViewDocumentsController', ['$scope', '$log', 'DataFetcher', '$stateParams', 'Auth', 
    function($scope, $log, DataFetcher, $stateParams, Auth) {

    DataFetcher.fetchBillDoc($stateParams.docUrl, Auth.user.token).then(function(data) {
        $scope.docContent = data[0].data.texto;
        $scope.billName = data[0].data.proposicao;
    });
}]);