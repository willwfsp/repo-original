myApp.factory('DataFetcher', ['$q','$http', '$log', '$rootScope', function($q, $http, $log, $rootScope){
    var databaseURL = $rootScope.app.databaseURL;
    var databaseToken = $rootScope.app.token;

    var results = {};
    var query = "";
    var proposicao = "";

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

        set_promise : function(url, method){
            var defer = $q.defer();

            $http({
                url: url,
                dataType: "json",
                method: method,
                headers: {
                    'Access-Control-Allow-Origin' : '*',
                    'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }                
            })
            .success(function(response){
                defer.resolve(response);
            })
            .error(function(status, error){
                defer.reject(status);
            })

            return defer.promise;
        }, 

        fetch_data_proposicoes : function(termos, filtros){
            console.log(filtros);
            var headers = {
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            };

            for(filtro in filtros){
                headers[filtro] = filtros[filtro];
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
                    $rootScope.$broadcast('search:completed');
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

        get_results : function(){
            return results;
        },
        get_query : function(){
            return query;
        }
    };
}]);


myApp.factory('DoSearch', ['$q', '$http', '$rootScope', '$log',
    function($q, $http, $rootScope, $log) {

    var searchResults = {};

    return {
        doRequest : function(appendUrl, body, method){
            var url = 'http://sigalei.mybluemix.net:80/sigalei/v1/apps/9b4b92a7-f710-4722-8fa4-18535d50bcb8/' + appendUrl;
            var defer = $q.defer();

            $http({
                url: url,
                dataType: "json",
                method: method,
                headers: {
                    'Access-Control-Allow-Origin' : '*',
                    'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                data: body

            }).success(function(res){

                defer.resolve(res);

            }).error(function(status, error){

                defer.reject(status);

            });
            return defer.promise;

        },

        browse : function(termos) {

            var myData = {};

            url = "proposicao/query";
            if (termos){
                url = url + "?q=" + termos;
            }
            debugger;
            var body = {
                "casas": [
                    "CN","CD","SF","MG"
                ],
                "bookmark": ""
            };

            var results = {};


            this.doRequest(url, body, "POST").then(function(res){ //Sucess

                searchResults = res;
                $rootScope.$broadcast('search:completed');

            },function(status){ //Error

                $log.log('Falha');
            }
            );


            return results;

        },

        getResults : function(){
            return searchResults;
        }
    };

}]);
