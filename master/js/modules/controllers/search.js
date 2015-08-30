/**=========================================================
 * Module: search.js
 * Searches logic (bills, representatives and comissions)
 =========================================================*/

App.controller('SearchBarController',
  ['$location', '$log', '$scope','$state',  'DataFetcher',
    function($location, $log, $scope, $state, DataFetcher){

    $scope.searchQ = function(){
        $state.go('app.searchBills', {q: $scope.query});
    };

}]);

App.controller('SearchBillsController',
  ['$http', '$stateParams', '$location', '$scope', '$log', '$state', '$modal',
  'DataFetcher', 'Auth', 'ngDialog', 'UserFolders',
    function($http, $stateParams, $location, $scope, $log, $state, $modal,
        DataFetcher, Auth, ngDialog, UserFolders) {

    $scope.isCollapsed = false;
    $scope.showOtherAuthors = false;
    $scope.themesAndSubthemes = [];
    $scope.themeSelected = "";
    $scope.subthemeSelected = "";
    $scope.orderedBy = 1;
    $scope.fetchingStart = true;
    $scope.fetchingMore = false;
    var _urlParam = $location.search();
    //search variables
    if('q' in _urlParam){
        $scope.query = _urlParam.q;
    }else{
        $scope.query = "";
    }

    $scope.bills = [];
    $scope.total_results = 0;
    $scope.bookmark = "";

    $scope.toDate = function(date){
      return date.substr(0,4) + "-" + date.substr(4,2) + "-" + date.substr(6,2);
    };

    $scope.parseAuthor = function(authorString){
        var author = {};
            try{
                author = authorString.split(",#");
            }
            catch(err){
                return authorString;
            }
            return {"name": author[0], "id": author[1]};
    };

    $scope.getMainAuthor = function(data){
        //if only one author
        if (typeof(data) == "string"){
            return $scope.parseAuthor(data);
        }
        //if array, return last author in array, who is the main author
        else if (data instanceof Array){
            return $scope.parseAuthor(data[data.length - 1]);
        }
        else{
            return "";
        }
    };

    $scope.hasCoauthors = function(billMainAuthor){
        if(billMainAuthor instanceof Array){
            return true;
        }
        return false;
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
    $scope.availableHouses =[
                                {'houseName': 'Congresso Nacional', 'initials': 'CN'},
                                {'houseName': 'São Paulo',          'initials': 'SP'},
                                {'houseName': 'Minas Gerais',       'initials': 'MG'}
                            ];

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
        $scope.bills = [];
        $scope.fetchingStart = true;
        DataFetcher.fetchSearchDataBills($scope.query, $scope.filters, Auth.user.token);
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
        $scope.bills = [];
        $scope.fetchingStart = true;
        DataFetcher.fetchSearchDataBills($scope.query, $scope.filters, Auth.user.token);
    };

    //Type Filter
    $scope.billTypesAvailable = [
                                    {'billTypeName': 'PL',                          'initials': 'PL'},
                                    {'billTypeName': 'PL Complementar',             'initials': 'PLComp'},
                                    {'billTypeName': 'PLN',                         'initials': 'PLN'},
                                    {'billTypeName': 'Medida Provisória',           'initials': 'MPV'},
                                    {'billTypeName': 'PEC',                         'initials': 'PEC'}
                                ];
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
        $scope.bills = [];
        $scope.fetchingStart = true;
        DataFetcher.fetchSearchDataBills($scope.query, $scope.filters, Auth.user.token);
    };

    // Theme Filter
    $scope.changeFilterTheme = function(){

        $scope.filters.subtema = $scope.themeSelected.subtema;
        $scope.filters.bookmark="";
        $scope.bills = [];
        $scope.fetchingStart = true;
        DataFetcher.fetchSearchDataBills($scope.query, $scope.filters, Auth.user.token);

    };

    //Year Filter
    $scope.year = "";

    $scope.changeFilterYear = function(){

        if( ($scope.year >= 1980 && $scope.year <= 2015) || $scope.year === ""){
            $scope.filters.ano = $scope.year.toString();
            $scope.filters.bookmark="";
            $scope.bills = [];
            $scope.fetchingStart = true;
            DataFetcher.fetchSearchDataBills($scope.query, $scope.filters, Auth.user.token);
        }
    };
    // Change Order
    $scope.changeOrder = function(){

        $scope.filters.ordem = $scope.orderedBy;
        $scope.filters.bookmark="";
        $scope.bills = [];
        $scope.fetchingStart = true;
        DataFetcher.fetchSearchDataBills($scope.query, $scope.filters, Auth.user.token);

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
        $scope.filters.subtema = "";
        $scope.bookmark = "";

        //fetch most recent data
        $scope.bills = [];
        $scope.fetchingStart = true;
        DataFetcher.fetchSearchDataBills($scope.query, $scope.filters, Auth.user.token);
    };

    $scope.init = function(){
        $scope.fetchingStart = true;
        $scope.loadThemes();
        DataFetcher.fetchSearchDataBills($scope.query, $scope.filters, Auth.user.token);
    };

    $scope.moreResults = function(){

        $scope.filters.bookmark = $scope.bookmark;
        $scope.fetchingMore = true;
        DataFetcher.fetchSearchDataBills($scope.query, $scope.filters, Auth.user.token);
    };

    $scope.follow = function(index){
        ngDialog.open({
              template: '<h2>Notice that there is no overlay!</h2>',
              className: 'ngdialog-theme-default',
              plain: true,
              overlay: false
            });
        if($scope.bills[index].hasOwnProperty('following')){
            $scope.bills[index].following = !$scope.bills[index].following
        }else{
            $scope.bills[index].following = true;
        }
    }

    // Listeners
    $scope.$on('fetch billSearchResults:completed', function(event) {
        // you could inspect the data to see if what you care about changed, or just update your own scope
        var aux = DataFetcher.getBillSearchResults();
        if ($scope.bills.length == 0){
            index = 0;
        }else{
            index = $scope.bills.length;
        }
        var count = 0;
        for (i = index; i < (index + aux.rows.length); i++) {

            $scope.tagsModel[i] = {};
            $scope.tagsModel[i].data = [];

            if (aux.rows[count].fields.hasOwnProperty('USER_TAGS')){
                aux.rows[count].fields.USER_TAGS.forEach(function(item){
                    $scope.tagsModel[i].data.push({id:item});
                })
            }
            count ++;

        }
        if ($scope.fetchingStart){
            $scope.total_results = aux.total_rows;
            $scope.bookmark = aux.bookmark;
            $scope.bills = aux.rows;
            $scope.fetchingStart = false;
        }
        if($scope.fetchingMore){
            for(i = 0; i < aux.rows.length; i++){
                $scope.bills.push(aux.rows[i]);
            }
            $scope.bookmark = aux.bookmark;
            $scope.fetchingMore = false;
        }

        //bill.fields.USER_TAGS



    });
    $scope.open = [];

    function getFindObj(id) {
        var findObj = {};

        findObj[$scope.tagsSettings.idProp] = id;

        return findObj;
    }

    function clearObject(object) {
        for (var prop in object) {
            delete object[prop];
        }
    }

    $scope.toggleDropdown = function(index){
        console.log("OK");
        $scope.tagsData[index] = {};
        if(!$scope.open[index]){
            $scope.tagsData[index].data = [];
            UserFolders.get(function(data){
                data.pastas.forEach(function(item){
                    var AuxObject = {};
                    AuxObject.id = item;
                    $scope.tagsData[index].data.push(AuxObject)
                });
            });

        }

        $scope.open[index] = !$scope.open[index];
    }
    $scope.getPropertyForObject = function (object, property) {
        if (angular.isDefined(object) && object.hasOwnProperty(property)) {
            return object[property];
        }

        return '';
    };

    $scope.setSelectedItem = function (id, dontRemove, index) {
        var findObj = getFindObj(id);
        var finalObj = null;

        finalObj = _.find($scope.tagsData[index].data, findObj);

        dontRemove = dontRemove || false;

        var exists = _.findIndex($scope.tagsModel[index].data, findObj) !== -1;

        if (!dontRemove && exists) {
            $scope.tagsModel[index].data.splice(_.findIndex($scope.tagsModel[index].data, findObj), 1);
            $scope.externalEvents.onItemDeselect(findObj);
        } else if (!exists) {
            $scope.tagsModel[index].data.push(finalObj);
            $scope.externalEvents.onItemSelect(finalObj);
        }
    };
    $scope.isChecked = function (id, index) {
        return _.findIndex($scope.tagsModel[index].data, getFindObj(id)) !== -1;
    };

    $scope.createTag = function(tag){
        console.log(tag);
    }
    $scope.initVariables = function(){
        $scope.tagsModel = [];
        $scope.tagsData = [];
    }
    $scope.removeTag = function(){
        console.log("Remover Tag");
    }

    $scope.externalEvents = {
        onItemSelect: angular.noop,
        onItemDeselect: angular.noop,
        onSelectAll: angular.noop,
        onDeselectAll: angular.noop,
        onInitDone: angular.noop,
        onMaxSelectionReached: angular.noop
    };

    $scope.tagsSettings = {
        dynamicTitle: false,
        displayProp: 'label',
        idProp: 'id',
        enableSearch: true,
        showCheckAll: false,
        showUncheckAll: false,
        scrollableHeight: '200',
        smartButtonMaxItems: 1,
    };

}]);
