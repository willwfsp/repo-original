/**=========================================================
 * Module: services.js
 * Factory to connect with the back-end api...

 =========================================================*/

App.factory('DataFetcher',
  ['$q','$http', '$log', '$rootScope',
    function($q, $http, $log, $rootScope){
    // Constants...
    var service = {};
    var baseUrl = "https://sigalei-api.mybluemix.net/v1/";
    var databaseToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im10YWthdGEiLCJlbWFpbCI6Im1hdGhldXN0YWthdGFAZ21haWwuY29tIiwiaWF0IjoxNDM5NTcxMjcwLCJleHAiOjE0Mzk1ODU2NzB9.eTaAzxcFFsoHIIxNCFtk9M7BxHiAuCwEH6UG4yOPDeg";
    $http.defaults.headers.common.authorization = " Bearer " + databaseToken;
    // "Private" Variables
    var _billSearchResults = {};

    service.fetchSearchDataBills = function(termos, filters){
        var query = "";
        var headers = {};
        var path = "proposicoes";
        var url = "";
        if(termos){
            query = '?q=' + termos;
        }   

        url = baseUrl + path + query;
        console.log(filters);
        return $http.post(url, filters).then(function(result) {
            _billSearchResults = result.data;
            $rootScope.$broadcast("fetch billSearchResults:completed");
        },
        function(reason){
            $log.error(reason);
        });
    };

    service.fetchBill = function(nome){

        var promiseBillDetails = $http.get(baseUrl + "proposicoes/" + nome);
        var promiseBillTrack = $http.get(baseUrl + "proposicoes/" + nome + "/tramitacao");
        var promiseBillPollList = $http.get(baseUrl + "proposicoes/" + nome + "/votacao");

        var defer = $q.defer();

        $q.all([promiseBillDetails, promiseBillTrack, promiseBillPollList])
          .then(function(results) {
            defer.resolve(results);

        });

        return defer.promise;
    };

    service.fetchDataPollDetails = function(id){
        var result;
        return $http.get(baseUrl + "proposicoes/votacao/" + id).then(function(result) {

            return result.data;
        },
        function(reason){
            $log.error(reason);
        });
    };

    service.fetchDataRepresentative = function(id){
        var promiseRepresentativeDetails = $http.get(baseUrl + "parlamentares/" + id);
        var promiseRepresentativeTemas = $http.get(baseUrl + "parlamentares/" + id + "/temas");
        var promiseRepresentativeMandatos = $http.get(baseUrl + "parlamentares/" + id +
            "/mandatos");
        var promiseRepresentativeProposicoes = $http.get(baseUrl + "parlamentares/" + id +
            "/proposicoes");
        var promiseRepresentativeCommittees = $http.get(baseUrl + "parlamentares/" + id +
            "/comissoes");

        var promiseRepresentativePhoto = $http.get(baseUrl + "parlamentares/" + id +
            "/foto");

        var defer = $q.defer();

        $q.all([promiseRepresentativeDetails,
                 promiseRepresentativeTemas,
                 promiseRepresentativeMandatos,
                 promiseRepresentativeProposicoes,
                 promiseRepresentativeCommittees,
                 promiseRepresentativePhoto])
          .then(function(results) {
            defer.resolve(results);

        });

        return defer.promise;
    }

    service.fetchDataHouseDetails = function(houseId){
        var result;

        var promiseHouseDetails = $http.get(baseUrl + "assembleias/" + houseId);
        var promiseHouseEvents = $http.get(baseUrl + "eventos/" + houseId);
        var promiseHouseCommittees = $http.get(baseUrl + "comissoes" +
            "?sigla=" + houseId);
        var promiseHouseMembers = $http.get(baseUrl + "parlamentares" +
            "?casa=" + houseId);

        var defer = $q.defer();

        $q.all([promiseHouseDetails,
                 promiseHouseEvents,
                 promiseHouseCommittees,
                 promiseHouseMembers])
          .then(function(results) {
            defer.resolve(results);
        });

        return defer.promise;

    };

    service.fetchCommitteeDetails = function(house, committeeID){

        var promiseCommitteeDetails = $http.get(baseUrl + "comissoes/" + house +
            "/" + committeeID);
        var promiseCommmitteeMembers = $http.get(baseUrl + "comissoes/" + house +
            "/" + committeeID + "/parlamentares");


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
