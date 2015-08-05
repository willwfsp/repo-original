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

    $scope.isCollapsed = false;
    $scope.loadThemes();
    $scope.showOtherAuthors = false;
    $scope.themesAndSubthemes = [];
    $scope.themeSelected = "";
    $scope.subthemeSelected = "";
    $scope.orderedBy = 1;

    $scope.fetching = false;
    $scope.$watch('fetching', function(){
        if($scope.fetching === true){
            if($scope.bookmark === ""){
                $scope.query = "";
                $scope.bills = [];
                $scope.total_results = 0;
                $scope.bookmark = "";
            }
        }
    }, true);
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
        "ano": "",
        "ordem":""
    };

    // House Filter
    $scope.availableHouses = ['CN','SP','MG'];
    $scope.checkedHouses = {};
    $scope.checkedHouses.list = [];

    $scope.changeFilterHouses = function(){
        $scope.filters.casas = [];
        var arrayLength = $scope.checkedHouses.list.length;
        for (var i = 0; i < arrayLength; i++) {
            var key = $scope.checkedHouses.list[i];
            if(key == "CN"){
                $scope.filters.casas.push(key);
                $scope.filters.casas.push("CD");
                $scope.filters.casas.push("SF");
            }
            else{
                $scope.filters.casas.push(key);
            }
        }
        $scope.filters.bookmark="";
        $scope.fetching = true;
        DataFetcher.fetchDataBills($scope.query, $scope.filters);
    };

    // Status Filter
    $scope.statusBillAvailable =["tramitando", "arquivado", "lei"];
    $scope.statusBill = {};
    $scope.statusBill.list = [];

    $scope.changeFilterStatus = function(){
        $scope.filters.status = [];
        var arrayLength = $scope.statusBill.list.length;

        for (var i = 0; i < arrayLength; i++) {
            var key = $scope.statusBill.list[i];
            $scope.filters.status.push(key);
        }

        $scope.filters.bookmark="";
        $scope.fetching = true;
        DataFetcher.fetchDataBills($scope.query, $scope.filters);
    };

    //Type Filter
    $scope.billTypesAvailable = ["PL", "PLComp", "PLN", "MPV", "PEC"];
    $scope.typeBill = {};
    $scope.typeBill.list = [];

    $scope.changeFilterBillTypes = function(){
        $scope.filters.tipos = [];
        var arrayLength = $scope.typeBill.list.length;

        for (var i = 0; i < arrayLength; i++) {
            var key = $scope.typeBill.list[i];
            $scope.filters.tipos.push(key);
        }

        $scope.filters.bookmark="";
        $scope.fetching = true;
        DataFetcher.fetchDataBills($scope.query, $scope.filters);
    };

    // Theme Filter
    $scope.changeFilterTheme = function(){

        $scope.filters.subtema = $scope.themeSelected.subtema;
        $scope.filters.bookmark="";
        $scope.fetching = true;
        DataFetcher.fetchDataBills($scope.query, $scope.filters);

    };

    //Year Filter
    $scope.year = "";

    $scope.changeFilterYear = function(){

        if( ($scope.year >= 1980 && $scope.year <= 2015) || $scope.year === ""){
            $scope.filters.ano = $scope.year.toString();
            $scope.filters.bookmark="";
            $scope.fetching = true;
            DataFetcher.fetchDataBills($scope.query, $scope.filters);
        }
    };
    // Change Order
    $scope.changeOrder = function(){

        $scope.filters.ordem = $scope.orderedBy;
        $scope.filters.bookmark="";
        $scope.fetching = true;
        DataFetcher.fetchDataBills($scope.query, $scope.filters);

    };

    $scope.cleanFilters = function(){
        //clean DOM variables
        $scope.checkedHouses.list = [];
        $scope.statusBill.list = [];
        $scope.typeBill.list = [];
        $scope.themeSelected = "";

        $scope.year = "";
        //clean filter
        $scope.filters.casas = [];
        $scope.filters.tipos = [];
        $scope.filters.status = [];
        $scope.filters.ano = "";
        $scope.bookmark = "";

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

myApp.filter('capitalize', function() {
    return function(input, all) {
        var inputAux = "";
        if(input.constructor === Array){
            input.forEach(function(name){
                inputAux = inputAux + ' - ' + name;
            });
            inputAux = inputAux.substring(3);
        }else{
            inputAux = input;
        }

      return (!!inputAux) ? inputAux.replace(/([^\W_]+[^\s-]*) */g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
    };
  }
);
