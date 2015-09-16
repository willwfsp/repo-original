/**=========================================================
 * Module: services.js
 * Factory to connect with the back-end api...

 =========================================================*/

App.factory('DataFetcher',
  ['$q','$http', '$log', '$rootScope', 'Auth',
    function($q, $http, $log, $rootScope, Auth){
    // Constants...
    var service = {};
    var baseUrl = $rootScope.apiURL;
    var ApiMgEndPoint = 'http://dadosabertos.almg.gov.br/ws';
    var MGDocUrl = "";
    // "Private" Variables
    var _billSearchResults = {};


    $http.defaults.headers['Access-Control-Allow-Origin'] = '*';
    $http.defaults.headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS, PUT';

    service.fetchSearchDataBills = function(termos, filters, token){
        var query = "";
        var headers = {
            headers: {'Authorization': 'Bearer ' + token,
                      'Access-Control-Allow-Origin' : '*',
                        'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'}
        };
        var path = "proposicoes";
        var url = "";
        if(termos){
            query = '?q=' + termos;
        }

        url = baseUrl + path + query;
        promiseBillSeach = $http.post(url, filters, headers);

        var defer = $q.defer();

        $q.all([promiseBillSeach])
          .then(function(results) {
            _billSearchResults = results[0].data;
            $rootScope.$broadcast("fetch billSearchResults:completed");

            defer.resolve(results);

        });

        return defer.promise;

    };

    service.fetchBill = function(nome, token){
        var headers = {
            headers: {'Authorization': 'Bearer ' + token,
                      'Access-Control-Allow-Origin' : '*',
                        'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'}
        };
        var promiseBillDetails = $http.get((baseUrl + "proposicoes/" + nome),headers);
        var promiseBillTrack = $http.get((baseUrl + "proposicoes/" + nome + "/tramitacao"), headers);
        var promiseBillPollList = $http.get((baseUrl + "proposicoes/" + nome + "/votacao"), headers);
        var promiseBillComments = $http.get((baseUrl + "usuarios/comentarios/proposicao/" + nome), headers);

        var defer = $q.defer();

        $q.all([promiseBillDetails, promiseBillTrack, promiseBillPollList, promiseBillComments])
          .then(function(results) {
            defer.resolve(results);

        });

        return defer.promise;
    };

    service.fetchDataPollDetails = function(id, token){
        var result;
        var headers = {
            headers: {'Authorization': 'Bearer ' + token,
                      'Access-Control-Allow-Origin' : '*',
                        'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'}
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
            headers: {'Authorization': 'Bearer ' + token,
                      'Access-Control-Allow-Origin' : '*',
                        'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'}
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
    };

    service.fetchMonthEvents = function(houseId, token){
        var result;
        var headers = {
            headers: {'Authorization': 'Bearer ' + token,
                      'Access-Control-Allow-Origin' : '*',
                        'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'}
        };
        var startDate = moment().format();
        var endDate= '2015-10';
        var url = baseUrl + "eventos/" + houseId + '?data_ini='+ startDate+'&data_fim=' + endDate;
        return $http.get(url,headers).then(function(result) {

            return result.data.eventos;
        },
        function(reason){
            $log.error(reason);
        });

    };

    service.fetchDataHouseDetails = function(houseId, token){
        var result;
        var headers = {
            headers: {'Authorization': 'Bearer ' + token,
                      'Access-Control-Allow-Origin' : '*',
                        'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'}
        };
        var promiseHouseDetails = $http.get((baseUrl + "assembleias/" + houseId),headers);
        //var promiseHouseEvents = $http.get((baseUrl + "eventos/" + houseId),headers);
        var promiseHouseCommittees = $http.get((baseUrl + "comissoes" +
            "?sigla=" + houseId),headers);
        var promiseHouseMembers = $http.get((baseUrl + "parlamentares" +
            "?casa=" + houseId),headers);

        var defer = $q.defer();

        $q.all([promiseHouseDetails,
                 //promiseHouseEvents,
                 promiseHouseCommittees,
                 promiseHouseMembers])
          .then(function(results) {

            if(results[0].data.SLAs_MESA_DIRETORA){
                var promisesPhotos = [];
                results[0].data.SLAs_MESA_DIRETORA.forEach(function(member) {

                    var promiseRepresentativePhoto = $http.get((baseUrl +
                        "parlamentares/" + member.id + "/foto"), headers);
                    promisesPhotos.push(promiseRepresentativePhoto);
                });

                $q.all(promisesPhotos)
                .then(function(resultsPhoto){
                    var resultItem = {};
                    resultItem.data =[];
                    for (index = 0; index < resultsPhoto.length; ++index) {
                        var arr = new Uint8Array(resultsPhoto[index].data);
                        var raw = '';
                        var i, j, subArray, chunk = 5000;
                        for (i = 0, j = arr.length; i < j; i += chunk) {
                            subArray = arr.subarray(i, i + chunk);
                            raw += String.fromCharCode.apply(null, subArray);
                        }

                        var b64 = btoa(raw);

                        results[0].data.SLAs_MESA_DIRETORA[index].photo = b64;
                    }
                });
            }
            defer.resolve(results);
        });

        return defer.promise;

    };

    service.fetchHousesNews = function(houseIds, token){
        var result;
        var headers = {
            headers: {'Authorization': 'Bearer ' + token,
                      'Access-Control-Allow-Origin' : '*',
                        'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'}
        };
        var promiseCongressNews =   $http.get((baseUrl + "noticias/" + houseIds[0]), headers);
        var promiseSenateNews =     $http.get((baseUrl + "noticias/" + houseIds[1]), headers);
        var promiseSpNews =         $http.get((baseUrl + "noticias/" + houseIds[2]), headers);
        var promiseMgNews =         $http.get((baseUrl + "noticias/" + houseIds[3]), headers);

        var defer = $q.defer();

        $q.all([promiseCongressNews,
                promiseSenateNews,
                promiseSpNews,
                promiseMgNews])
            .then(function(results) {
                defer.resolve(results);
        });

        return defer.promise;

    };

    service.fetchCommitteeDetails = function(house, committeeID, token){
        var headers = {
            headers: {'Authorization': 'Bearer ' + token,
                      'Access-Control-Allow-Origin' : '*',
                        'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'}
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

    service.fetchUserDetails = function(token){
        var headers = {
            headers: {'Authorization': 'Bearer ' + token,
                      'Access-Control-Allow-Origin' : '*',
                        'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'}
        };
        var promiseUserData = $http.get((baseUrl + "usuarios/perfil"), headers);

        var defer = $q.defer();

        $q.all([promiseUserData])
          .then(function(results) {
            defer.resolve(results);
        }, function(reason){
            $log.log(reason);
        });

        return defer.promise;
    };

    service.setMGDocUrl = function(url){
        MGDocUrl = url;
        return;
    };

    service.getApiMgEndPoint = function(){
        return ApiMgEndPoint;
    };

    service.fetchBillDoc = function(url, token){
        var headers = {
            headers: {'Authorization': 'Bearer ' + token}
        };
        var body = {
            "url": ApiMgEndPoint + '/proposicoes/pesquisa/avancada?expr=' + url
        };
        var defer = $q.defer();
        var promiseDoc = $http.post(baseUrl + "proposicoes/documentos/mg", body, headers);
        $q.all([promiseDoc])
          .then(function(results) {
            defer.resolve(results);
        });

        return defer.promise;
    };

    service.getBillSearchResults = function(){
        return _billSearchResults;
    };


    return service;

}]);
