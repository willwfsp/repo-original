App.controller('ViewDocumentsController', ['$scope','$state', '$log', 'DataFetcher', '$stateParams', 'Auth','$rootScope', 'CacheManager',
    function($scope, $state, $log, $stateParams,  $rootScope, DataFetcher, Auth, CacheManager) {

    $rootScope.$broadcast("event:show-loading");

    var cacheAllowed = $state.current.data.cache;

    if(cacheAllowed && CacheManager.fetchBillDoc()){
        prepareData(CacheManager.fetchBillDoc());
    }else{
    	DataFetcher.fetchBillDoc($stateParams.docUrl, Auth.user.token).then(function(data) {
            CacheManager.cacheBillDoc(data);
            prepareData(data);
        });
    }

    function prepareData (data){
        $scope.docContent = data[0].data.texto;
        $scope.billName = data[0].data.proposicao;

        $rootScope.$broadcast("event:dismiss-loading");

    }
}]);
