
myApp.controller('searchBar', ['$scope','$state', '$log',  'DoSearch', function($scope, $state, $log, DoSearch){

    $scope.searchQ = function(){
        DoSearch.browse($scope.termos);
        $log.log($scope.termos);
        $state.go('app.search');
    };

}]);

myApp.controller('searchResults', ['$location', '$scope', '$log', '$state', 'DoSearch', function($location, $scope, $log, $state, DoSearch) {
    $scope.query = "";
    $scope.dados = [];
    $scope.hasLoaded = false;
    $scope.numero_resultados = 0;
    $scope.casas_marcadas = {
        "senado_federal": false,
        "congresso_nacional": false,
        "camara_deputados": false
    };
    $scope.tipos_lei = {
        "projeto_lei_ordinaria": false,
        "projeto_lei_complementar": false,
        "medida_provisoria": false,
        "projeto_ementa_constituconal": false,
        "projeto_lei_nacional": false
    };

    $scope.init = function(){
        if($location.search().q === undefined){
            console.log("no filters");
        }
        else{
            console.log($location.search().q);
            $scope.query = $location.search().q;
            DoSearch.browse($scope.query);            
        }

    };
    /*
    $scope.filtro_casas = function(){
        var casas = "";
        for(key in $scope.casas_marcadas){
            if($scope.casas_marcadas[key])
                //casas +=
        }
    }
    */
    $scope.$on('search:completed', function(event) {
        // you could inspect the data to see if what you care about changed, or just update your own scope
        $log.log('TESTE');
        $scope.numero_resultados = DoSearch.getResults().total_rows;
        $scope.dados = DoSearch.getResults().rows;
        $scope.query = DoSearch.getQuery();
        $scope.hasLoaded = true;
    });

    //Converte a data que vem no formato "yyyymmdd", fora de padrão
    $scope.toDate = function(dateStr){

        var date = dateStr.substr(0, 4) + '-' + dateStr.substr(4, 2) + '-' + dateStr.substr(6, 2) + ' 00:00:00';

        var t = date.split(/[- :]/);

        // Apply each element to the Date function
        var d = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
        var actiondate = new Date(d);

        return actiondate;

    };

}]);
