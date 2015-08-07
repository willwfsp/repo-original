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
        var promiseBillPollList = $http.get(baseUrl + "proposicoes/" + nome + "/votacao" +
            '?access_token=' + databaseToken);

        var defer = $q.defer();

        $q.all([promiseBillDetails, promiseBillTrack, promiseBillPollList])
          .then(function(results) {
            defer.resolve(results);

        });

        return defer.promise;
    };

    service.fetchDataPollDetails = function(id){
        var result;
        return $http.get(baseUrl + "proposicoes/votacao/" + id +
            '?access_token=' + databaseToken).then(function(result) {

            return result.data;
        },
        function(reason){
            $log.error(reason);
        });
    };

    service.fetchDataRepresentative = function(id){
        var promiseRepresentativeDetails = $http.get(baseUrl + "parlamentares/" + id +
            '?access_token=' + databaseToken);
        var promiseRepresentativeTemas = $http.get(baseUrl + "parlamentares/" + id + "/temas" +
            '?access_token=' + databaseToken);
        var promiseRepresentativeMandatos = $http.get(baseUrl + "parlamentares/" + id +
            "/mandatos" + '?access_token=' + databaseToken);
        var promiseRepresentativeProposicoes = $http.get(baseUrl + "parlamentares/" + id +
            "/proposicoes" + '?access_token=' + databaseToken);
        var promiseRepresentativeCommittees = $http.get(baseUrl + "parlamentares/" + id +
            "/comissoes" + '?access_token=' + databaseToken);

        var defer = $q.defer();

        $q.all([promiseRepresentativeDetails,
                 promiseRepresentativeTemas,
                 promiseRepresentativeMandatos,
                 promiseRepresentativeProposicoes,
                 promiseRepresentativeCommittees])
          .then(function(results) {
            defer.resolve(results);

        });

        return defer.promise;
    }

    service.fetchDataHouseDetails = function(houseId){
        var result;
        return $http.get(baseUrl + "assembleias/" + houseId +
            '?access_token=' + databaseToken).then(function(result) {

            return result.data;
        },
        function(reason){
            $log.error(reason);
        });
    };

    service.fetchCommitteeDetails = function(house, committeeID){

        var promiseCommitteeDetails = $http.get(baseUrl + "comissoes/" + house +
            "/" + committeeID + '?access_token=' + databaseToken);
        var promiseCommmitteeMembers = $http.get(baseUrl + "comissoes/" + house +
            "/" + committeeID + "/parlamentares" + '?access_token=' + databaseToken);


        var defer = $q.defer();

        $q.all([promiseCommitteeDetails, promiseCommmitteeMembers])
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
