myApp.factory('DataFetcher', ['$q','$http', '$log', '$rootScope', function($q, $http, $log, $rootScope){
    var databaseURL = 'http://sigalei-api.mybluemix.net/v1/';
    var databaseToken = "admin@sigalei";

    var results = {};
    var tramitacoes = [];
    var polls = [];
    var query = "";
    var proposicao = "";
    var bookmark = "";
    var request_stub = {
        dataType: "json",
        headers: {
            'Access-Control-Allow-Origin' : '*',
            'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }           
    };

    return {

        fetchDataBills : function(termos, filters){
            var headers = {
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            };

            for(filter in filters){
                headers[filter] = filters[filter];
            };

            url = databaseURL + 'proposicoes?';

            if(termos){
                url += 'q=' + termos + '&';
            };

            url += 'access_token=' + databaseToken;
            $http.post(url, headers)
                .success(function(data){
                    results = data;
                    query = termos || "";
                    if(filters && filters.bookmark != ""){
                        $rootScope.$broadcast('search more results: completed')
                    }
                    else{
                        $rootScope.$broadcast('search:completed');
                    }
                })
                .error(function(status, error){
                    $log.log('error');
                });
        },
        
        fetchDataRepresentative : function(IdRepresentative){
            var req = request_stub;
            req.url = databaseURL + 'parlamentares/' + IdRepresentative +'?access_token='+ databaseToken;
            req.method = 'GET';
            $http.get(req.url)
                .success(function(data){
                    results = data;
                    $rootScope.$broadcast('fetch:completed');
                })
                .error(function(status, error){
                    $log.log('error');
                });
        },
        fetchDataRepresentativePhoto : function(IdRepresentative){
            var url = databaseURL + 'parlamentares/' + IdRepresentative +'/photo?access_token='+ databaseToken;
            var promise = $http.get(req.url)
                .success(function(data){
                    results = data;
                    $rootScope.$broadcast('fetch:completed');
                })
                .error(function(status, error){
                    $log.log('error');
                });
            return 
        },
        fetch_data_proposicao : function(nome){
            var req = request_stub;
            req.url = databaseURL + 'proposicoes/' + nome +'?access_token='+ databaseToken;
            req.method = 'GET';
            console.log(req.url);
            $http.get(req.url)
                .success(function(data){
                    results = data;
                    $rootScope.$broadcast('fetch:completed');
                })
                .error(function(status, error){
                    $log.log('error');
                });
        },

        fetchDataTramitacoes : function(nome){
            var req = request_stub;
            req.url = databaseURL + 'proposicoes/' + nome +'/tramitacao?access_token='+ databaseToken;
            req.method = 'GET';
            $http.get(req.url)
                .success(function(data){
                    tramitacoes = data;
                    $rootScope.$broadcast('fetch tramitacoes:completed');
                })
                .error(function(status, error){
                    $log.log('error');
                });

        },

        fetchDataPolls : function(name){
            var url = databaseURL + 'proposicoes/' + name +'/votacao?access_token='+ databaseToken;
            $http.get(url)
                .success(function(data){
                    polls = data;
                    $rootScope.$broadcast('fetch polls:completed');
                })
                .error(function(status, error){
                    $log.log('error' + error);
                });
        },

        fetchDataCongresso : function(){
            var req = request_stub;
            var congresso_key = 'CN';
            req.url = databaseURL + 'assembleias/' + congresso_key+ '?access_token=' + databaseToken;
            req.method = 'GET';
            console.log(req);

            $http(req)
                .success(function(data){
                    results = data;
                    $rootScope.$broadcast('fetch:completed');
                })
                .error(function(status, error){
                    $log.log('error');
                });
        },

        fetch_data_camara : function(){
            var req = request_stub;
            var congresso_key = 'eed505570f32a32977ada84991c743c6';
            req.url = databaseURL + 'assembleias/' + congresso_key+ '?access_token=' + databaseToken;
            req.method = 'GET';

            $http(req)
                .success(function(data){
                    results = data;
                    $rootScope.$broadcast('fetch:completed');
                })
                .error(function(status, error){
                    $log.log('error');
                });
        },

        fetch_data_senado : function(){
            var req = request_stub;
            var congresso_key = 'eed505570f32a32977ada84991c7295c';
            req.url = databaseURL + 'assembleias/' + congresso_key+ '?access_token=' + databaseToken;
            req.method = 'GET';

            $http(req)
                .success(function(data){
                    results = data;
                    $rootScope.$broadcast('fetch:completed');
                })
                .error(function(status, error){
                    $log.log('error');
                });
        },

        getResults : function(){
            return results;
        },

        getQuery : function(){
            return query;
        },

        getTramitacoes : function(){
            return tramitacoes;
        },

        getPolls : function(){
            return polls;
        }
    };
}]);
