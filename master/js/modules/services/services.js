/**=========================================================
 * Module: services.js
 * Factory to connect with the back-end api...

 =========================================================*/

App.factory('DataFetcher',
  ['$q','$http', '$log', '$rootScope', 'Auth',
    function($q, $http, $log, $rootScope, Auth){
    // Constants...
    var service = {};
    var baseUrl = "https://sigalei-api.mybluemix.net/v1/";

    // "Private" Variables
    var _billSearchResults = {};

    service.fetchSearchDataBills = function(termos, filters, token){
        var query = "";
        var headers = {
            headers: {'Authorization': 'Bearer ' + token}
        };
        var path = "proposicoes";
        var url = "";
        if(termos){
            query = '?q=' + termos;
        }

        url = baseUrl + path + query;


        return $http.post(url, filters, headers).then(function(result) {
            _billSearchResults = result.data;
            $rootScope.$broadcast("fetch billSearchResults:completed");
        },
        function(reason){
            $log.error(reason);
        });
    };

    service.fetchBill = function(nome, token){
        var headers = {
            headers: {'Authorization': 'Bearer ' + token}
        };
        var promiseBillDetails = $http.get((baseUrl + "proposicoes/" + nome),headers);
        var promiseBillTrack = $http.get((baseUrl + "proposicoes/" + nome + "/tramitacao"), headers);
        var promiseBillPollList = $http.get((baseUrl + "proposicoes/" + nome + "/votacao"), headers);

        var defer = $q.defer();

        $q.all([promiseBillDetails, promiseBillTrack, promiseBillPollList])
          .then(function(results) {
            defer.resolve(results);

        });

        return defer.promise;
    };

    service.fetchDataPollDetails = function(id, token){
        var result;
        var headers = {
            headers: {'Authorization': 'Bearer ' + token}
        };
        return $http.get((baseUrl + "proposicoes/votacao/" + id),headers).then(function(result) {

            return result.data;
        },
        function(reason){
            $log.error(reason);
        });
    };

    service.fetchDataRepresentative = function(id, token){
        var headers = {
            headers: {'Authorization': 'Bearer ' + token}
        };
        var promiseRepresentativeDetails = $http.get((baseUrl + "parlamentares/" + id),headers);
        var promiseRepresentativeTemas = $http.get((baseUrl + "parlamentares/" + id + "/temas"),headers);
        var promiseRepresentativeMandatos = $http.get((baseUrl + "parlamentares/" + id +
            "/mandatos"),headers);
        var promiseRepresentativeProposicoes = $http.get((baseUrl + "parlamentares/" + id +
            "/proposicoes"),headers);
        var promiseRepresentativeCommittees = $http.get((baseUrl + "parlamentares/" + id +
            "/comissoes"),headers);

        var promiseRepresentativePhoto = $http.get((baseUrl + "parlamentares/" + id +
            "/foto"),headers);

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

    service.fetchDataHouseDetails = function(houseId, token){
        var result;
        var headers = {
            headers: {'Authorization': 'Bearer ' + token}
        };
        var promiseHouseDetails = $http.get((baseUrl + "assembleias/" + houseId),headers);
        var promiseHouseEvents = $http.get((baseUrl + "eventos/" + houseId),headers);
        var promiseHouseCommittees = $http.get((baseUrl + "comissoes" +
            "?sigla=" + houseId),headers);
        var promiseHouseMembers = $http.get((baseUrl + "parlamentares" +
            "?casa=" + houseId),headers);

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

    service.fetchCommitteeDetails = function(house, committeeID, token){
        var headers = {
            headers: {'Authorization': 'Bearer ' + token}
        };
        var promiseCommitteeDetails = $http.get((baseUrl + "comissoes/" + house +
            "/" + committeeID),headers);
        var promiseCommmitteeMembers = $http.get((baseUrl + "comissoes/" + house +
            "/" + committeeID + "/parlamentares"),headers);


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
