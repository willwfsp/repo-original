/**=========================================================
 * Module: services.js
 * Factory to connect with the back-end api...

 =========================================================*/

myApp.factory('DataFetcher',
  ['$q','$http', '$log', '$rootScope',
    function($q, $http, $log, $rootScope){
    // Constants...
    var service = {};

    var baseUrl = "https://sigalei-api.mybluemix.net/v1/";
    var databaseToken = "admin@sigalei";

    var request_stub = {
        dataType: "json",
        headers: {
            'Access-Control-Allow-Origin' : '*',
            'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };
    // "Private" Variables
    var _billSearchResults = {};

    service.fetchDataBills = function(termos, filters){
        var query = "";
        var headers = {};
        var path = "proposicoes";
        var url = "";
        if(termos){
            query = '&q=' + termos;
        }

        url = baseUrl + path + '?access_token=' + databaseToken + query;

        return $http.post(url, filters).then(function(result) {
            _billSearchResults = result.data;
            $rootScope.$broadcast("fetch billSearchResults:completed");
        },
        function(reason){
            $log.error(reason);
        });
    };

    service.getBillSearchResults = function(){
        return _billSearchResults;
    }

    return service;

}]);
