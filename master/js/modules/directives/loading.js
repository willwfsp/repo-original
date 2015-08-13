App.directive('loading',   ['$http', '$state' ,function ($http, $state){
  return {
    restrict: 'A',
    link: function (scope, elm, attrs)
    {
      scope.isLoading = function () {
        return $http.pendingRequests.length > 0 && !$state.is('app.searchBills');
      };

      scope.$watch(scope.isLoading, function (v)
      {
        if(v){
            elm.show();
        }else{
            elm.hide();
        }
      });
    }
  };
}]);