/**=========================================================
 * Module: search.js
 * Searches logic (bills, representatives and comissions)
 =========================================================*/

myApp.controller('SearchBarController', ['$location', '$scope','$state',  'DataFetcher', function($location, $scope, $state, DataFetcher){

    $scope.searchQ = function(){
        DataFetcher.fetchDataBills($scope.query);
        $state.go('app.searchBills', {q: $scope.query});
    };

}]);

myApp.controller('SearchBillsController', ['$http', '$stateParams', '$location',
    '$scope', '$log', '$state', '$modal', 'DataFetcher',
    function($http, $stateParams, $location, $scope, $log, $state, $modal, DataFetcher) {

    $scope.toDate = function(date){
      return date.substr(0,4) + "-" + date.substr(4,2) + "-" + date.substr(6,2);
    };

    $scope.parseAuthor = function(authorString){
        var author = "";
            try{
                author = authorString.split(",");
            }
            catch(err){
                return authorString;
            }
            return {"name": author[0], "id": author[1]};
    };

    $scope.getMainAuthor = function(data){
        if (typeof(data) == "string"){
            return $scope.parseAuthor(data);
        }
        //if array, return first author
        if (data instanceof Array){
            authors = $scope.parseAuthor(data[data.length - 1]);
            authors.length = data.length - 1;
            return authors;
        }
        return "Error";
    };


    $scope.loadThemes = function(){
        var themesJson = 'server/onthology.json';
        $http.get(themesJson)
            .success(function(data){
                $scope.themesAndSubthemes = data;
            })
            .error(function(data, status, headers, config){
                console.log("error loading themes");
            });
    };

    $scope.loadThemes();

    $scope.showOtherAuthors = false;
    $scope.themesAndSubthemes = [];
    $scope.themeSelected = "";
    $scope.subthemeSelected = "";
    $scope.orderedBy = 1;
    //filter variables
    $scope.checkedHouses = {
        "CN": false,
        "SP": false,
        "MG": false
    };

    $scope.statusBill = {
        "tramitando": false,
        "arquivado": false,
        "lei": false
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
        "status":[],
        "subtema": "",
        "ano": ""
    };
    // functions to change filter parameters and fetch data again
    $scope.changeFilterYear = function(){

        if( ($scope.year >= 1980 && $scope.year <= 2015) || $scope.year === ""){
            $scope.filters.ano = $scope.year.toString();
            $scope.filters.bookmark="";
            $scope.fetching = true;
            DataFetcher.fetchDataBills($scope.query, $scope.filters);
        }
    };
    $scope.changeFilterTheme = function(){

        $scope.filters.subtema = $scope.themeSelected.subtema;
        $scope.filters.bookmark="";
        $scope.fetching = true;
        DataFetcher.fetchDataBills($scope.query, $scope.filters);

    };

    $scope.changeFilterHouses = function(){
        $scope.filters.casas = [];
        for(var key in $scope.checkedHouses){
            if($scope.checkedHouses[key]){
                if(key == "CN"){
                    $scope.filters.casas.push(key);
                    $scope.filters.casas.push("CD");
                    $scope.filters.casas.push("SF");
                }
                else{
                    $scope.filters.casas.push(key);
                }
            }
        }
        $scope.filters.bookmark="";
        $scope.fetching = true;
        DataFetcher.fetchDataBills($scope.query, $scope.filters);
    };

    $scope.changeFilterBillTypes = function(){
        $scope.filters.tipos = [];
        for(var key in $scope.billTypes){
            if($scope.billTypes[key]){
                $scope.filters.tipos.push(key);
            }
        }
        $scope.filters.bookmark="";
        $scope.fetching = true;
        DataFetcher.fetchDataBills($scope.query, $scope.filters);
    };

    $scope.changeStatus = function(){
        $scope.filters.status = [];
        for(var key in $scope.statusBill){
            if($scope.statusBill[key]){
                $scope.filters.status.push(key);
            }
        }
        $scope.filters.bookmark="";
        $scope.fetching = true;
        DataFetcher.fetchDataBills($scope.query, $scope.filters);
    };

    $scope.cleanFilters = function(){
        //clean DOM variables
        for(var key in $scope.checkedHouses){
            $scope.checkedHouses[key] = false;
        }

        for(var key1 in $scope.billTypes){
            $scope.billTypes[key1] = false;
        }
        $scope.year = "";
        //clean filter
        $scope.filters.casas = [];
        $scope.filters.tipos = [];
        $scope.filters.ano = "";
        $scope.bookmark = "";
        $scope.themeSelected = "";
        //fetch most recent data
        $scope.fetching = true;
        DataFetcher.fetchDataBills($scope.query, $scope.filters);
    };

    $scope.init = function(){
        $scope.fetching = true;
        DataFetcher.fetchDataBills($stateParams.q);
    };

    $scope.moreResults = function(){

        if($scope.fetching === true){
            return;
        }
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
        $scope.fetching = false;
    });

    $scope.$on('search more results: completed', function(event) {
        // you could inspect the data to see if what you care about changed, or just update your own scope
        for(i = 0; i < DataFetcher.getResults().rows.length; i++){
            $scope.bills.push(DataFetcher.getResults().rows[i]);
        }
        $scope.bookmark = DataFetcher.getResults().bookmark;
        $scope.query = DataFetcher.getQuery();
        $scope.fetching = false;
        //console.log($scope.bills.length);
    });

}]);

myApp.controller('PopOverController', ['$scope', function($scope){
}]);
