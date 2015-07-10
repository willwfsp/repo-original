myApp.factory('DataFetcher', ['$q','$http', '$log', '$rootScope', function($q, $http, $log, $rootScope){
    var databaseURL = 'http://sigalei-api.mybluemix.net/v1/';
    var databaseToken = "admin@sigalei";

    var results = {};
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
            console.log(filters);
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
                        console.log("I'm here");
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

        fetch_data_congresso : function(){
            var req = request_stub;
            var congresso_key = 'eed505570f32a32977ada84991c73457';
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

        fetch_data_senado : function(){
            var req = request_stub;
            var congresso_key = 'eed505570f32a32977ada84991c7295c';
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

        getResults : function(){
            return results;
        },
        getQuery : function(){
            return query;
        }
    };
}]);
