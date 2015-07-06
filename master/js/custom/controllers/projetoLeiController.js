myApp.controller('projetoLeiController', ['$scope','$state', '$log',  '$http', function($scope, $state, $log, $http){
	$scope.projeto = {};
    $scope.fetchProjeto = function(){
        $http.get("http://sigalei.mybluemix.net:80/sigalei/v1/apps/9b4b92a7-f710-4722-8fa4-18535d50bcb8/proposicao/CD-PL-1992-2007")
        .success(function(data){
        	$scope.projeto = data;
        })
        .error(function(data){
        	$log.log("Error");
        });

    };

}]);