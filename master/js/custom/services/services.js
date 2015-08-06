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

    // "Private" Variables
    var _billSearchResults = {};

    service.fetchSearchDataBills = function(termos, filters){
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
    service.fetchBill = function(nome){

        var promiseBillDetails = $http.get(baseUrl + "proposicoes/" + nome +
            '?access_token=' + databaseToken);
        var promiseBillTrack = $http.get(baseUrl + "proposicoes/" + nome + "/tramitacao" +
            '?access_token=' + databaseToken);
        var promiseBillVotingList = $http.get(baseUrl + "proposicoes/" + nome + "/votacao" +
            '?access_token=' + databaseToken);

        var defer = $q.defer();

        $q.all([promiseBillDetails, promiseBillTrack, promiseBillVotingList])
          .then(function(results) {
            defer.resolve(results);

        });

        return defer.promise;
    };


    service.getBillSearchResults = function(){
        return _billSearchResults;
    }

    return service;

}]);
