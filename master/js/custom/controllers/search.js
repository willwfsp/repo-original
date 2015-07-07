
myApp.controller('searchBar', ['$scope','$state', '$log',  'DataFetcher', function($scope, $state, $log, DataFetcher){

    $scope.searchQ = function(){
        DataFetcher.fetch_data_proposicoes($scope.termos);
        $state.go('app.search');
    };

}]);

myApp.controller('searchResults', ['$location', '$scope', '$log', '$state', 'DataFetcher', function($location, $scope, $log, $state, DataFetcher) {
    var filters_stub = {
        "bookmark": "",
        "casas": [],
        "tipos": [],
        "ano": ""
    };

    $scope.query = "";
    $scope.dados = [];
    $scope.hasLoaded = false;
    $scope.numero_resultados = 0;

    $scope.filters = filters_stub;

    $scope.casas_marcadas = {
        "CN": false,
        "CD": false,
        "SF": false
    };
    $scope.tipos_lei = {
        "PL": false,
        "PLN": false,
        "MPV": false,
        "PEC": false
    };

    $scope.limpar_filtros = function(){
        console.log("hi!");
        for(key in $scope.casas_marcadas){
            $scope.casas_marcadas[key] = false;
        };
        for(key in $scope.tipos_lei){
            $scope.tipos_lei[key] = false;
        };
        $scope.filters = filters_stub;
    };

    $scope.change_filtro_casas = function(){
        $scope.filters.casas = [];
        for(key in $scope.casas_marcadas){
            if($scope.casas_marcadas[key]){
                $scope.filters.casas.push(key);
            };
        };
        console.log("hey!");
        DataFetcher.fetch_data_proposicoes($scope.query, $scope.filters);
    };
    
    $scope.change_filtro_tipos_lei = function(){
        $scope.filters.tipos = [];
        for(key in $scope.tipos_lei){
            if($scope.tipos_lei[key]){
                $scope.filters.tipos.push(key);
            };
        };
        console.log("Hello!");
        DataFetcher.fetch_data_proposicoes($scope.query, $scope.filters);
    };
    
    $scope.init = function(){
        /*
        if($location.search().q === undefined){
            console.log("no query");
        }
        else{
            console.log($location.search().q);
            $scope.query = $location.search().q;
            DataFetcher.browse($scope.query);            
        }
        */
        DataFetcher.fetch_data_proposicoes();
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
        $scope.numero_resultados = DataFetcher.get_results().total_rows;
        $scope.dados = DataFetcher.get_results().rows;
        $scope.query = DataFetcher.get_query();
        $scope.hasLoaded = true;
        console.log($scope.dados[0].id);
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
