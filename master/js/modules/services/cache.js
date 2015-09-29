/**=========================================================
 * Module: cache.js
 * Factory to manage cache data...

 =========================================================*/

App.factory('CacheManager',
  ['$cacheFactory',
    function($cacheFactory){

    var service = {};
    var keys = [];
    var cache = $cacheFactory('dataFetchCache');

    var put = function(key,value){
      if (angular.isUndefined(cache.get(key))) {
        keys.push(key);
      }
      cache.put(key, angular.isUndefined(value) ? null : value);
    }

    var get = function(key){
      if (angular.isUndefined(cache.get(key))) {
        return null;
      }
      return cache.get(key);
    }

    service.fetchSearchDataBills = function(){

      return get("searchDataBills");

    };

    service.cacheSearchDataBills = function(data) {
      put("searchDataBills", data);
    }
    return service;

}]);
