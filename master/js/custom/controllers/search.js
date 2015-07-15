
myApp.controller('searchBar', ['$location', '$scope','$state',  'DataFetcher', function($location, $scope, $state, DataFetcher){

    $scope.searchQ = function(){

        DataFetcher.fetchDataBills($scope.query);
        $state.go('app.search', {q: $scope.query});
    };

}]);

myApp.controller('searchResults', ['$stateParams', '$location', '$scope', '$log', '$state', 'DataFetcher', function($stateParams, $location, $scope, $log, $state, DataFetcher) {
    
    //filter variables
    $scope.checkedHouses = {
        "CN": false,
        "CD": false,
        "SF": false
    };

    $scope.billTypes = {
        "PL": false,
        "PLComp": false,
        "PLN": false,
        "MPV": false,
        "PEC": false
    };
    $scope.year = "";

    $scope.fetching = false;
    //search variables
    $scope.query = "";
    $scope.bills = [];
    $scope.total_results = 0;
    $scope.bookmark = "";

    //filter body
    $scope.filters = {
        "bookmark": "",
        "casas": [],
        "tipos": [],
        "ano": ""
    };

    // functions to change filter parameters and fetch data again
    $scope.changeFilterYear = function(){
        
        if( ($scope.year >= 1980 && $scope.year <= 2015) || $scope.year == ""){
            $scope.filters.ano = $scope.year.toString();
            $scope.filters.bookmark="";
            DataFetcher.fetchDataBills($scope.query, $scope.filters);
        };
    };

    $scope.changeFilterHouses = function(){
        $scope.filters.casas = [];
        for(key in $scope.checkedHouses){
            if($scope.checkedHouses[key]){
                $scope.filters.casas.push(key);
            };
        };
        $scope.filters.bookmark="";
        DataFetcher.fetchDataBills($scope.query, $scope.filters);
    };
    
    $scope.changeFilterBillTypes = function(){
        $scope.filters.tipos = [];
        for(key in $scope.billTypes){
            if($scope.billTypes[key]){
                $scope.filters.tipos.push(key);
            };
        };
        $scope.filters.bookmark="";
        DataFetcher.fetchDataBills($scope.query, $scope.filters);
    };

    $scope.cleanFilters = function(){
        //clean DOM variables
        for(key in $scope.checked_houses){
            $scope.checked_houses[key] = false;
        };
        for(key in $scope.bill_types){
            $scope.bill_types[key] = false;
        };
        $scope.year = "";
        //clean filter
        $scope.filters.casas = [];
        $scope.filters.tipos = [];
        $scope.filters.ano = "";
        $scope.bookmark = "";
        //fetch most recent data
        DataFetcher.fetchDataBills("", $scope.filters);
    };

    $scope.init = function(){
        DataFetcher.fetchDataBills();
        console.log($stateParams);
        $scope.fetching = true;
    };

    $scope.moreResults = function(){
        if($scope.fetching == true){
            return
        };
        $scope.filters.bookmark = $scope.bookmark;
        $scope.fetching = true;
        DataFetcher.fetchDataBills($scope.query, $scope.filters);
    };

    $scope.$on('search:completed', function(event) {
        // you could inspect the data to see if what you care about changed, or just update your own scope
        $scope.total_results = DataFetcher.getResults().total_rows;
        $scope.bills = DataFetcher.getResults().rows;
        $scope.query = DataFetcher.getQuery();
        $scope.bookmark = DataFetcher.getResults().bookmark;
        var location = $location.path() + '?' + $scope.query;
        $scope.fetching = false;
        console.log(location);
        $location.path(location);
    });
    
    $scope.$on('search more results: completed', function(event) {
        // you could inspect the data to see if what you care about changed, or just update your own scope
        for(i = 0; i < DataFetcher.getResults().rows.length; i++){
            $scope.bills.push(DataFetcher.getResults().rows[i]);
        }
        $scope.bookmark = DataFetcher.getResults().bookmark;
        $scope.query = DataFetcher.getQuery();
        $scope.fetching = false;
        console.log($scope.bills.length);
    });

}]);
