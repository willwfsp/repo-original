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

    // SearchBillsController cache methods

    service.fetchSearchDataBills = function(query){
      var cacheArray = get("searchDataBills");
      debugger;
      if (cacheArray == undefined) {
        return false;
      }


      for (var i = 0; i < cacheArray.length; i++) {
        if (cacheArray[i].query === undefined || query === undefined) {
          return false;
        }
        // Verify if the query already exist
        if (cacheArray[i].query.toUpperCase() === query.toUpperCase()) {
          return cacheArray[i].data;
        }
      }

      return false;

    }

    service.cacheSearchDataBills = function(object, lastQuery) {

      var cacheArray = get("searchDataBills");

      var object = {};
      for (object in cacheArray) {
        if (object.query === undefined || lastQuery === undefined) {
          return false;
        }

        if (object.query.toUpperCase() === lastQuery.toUpperCase()) {
          return;
        }
      }

      if (cacheArray === null || cacheArray === undefined) {
        // Init local cache array
        cacheArray = [];
      }

      cacheArray.push({query:lastQuery,data:object});

      if (cacheArray.length > 5) {
        cacheArray.shift();
      };
      put("searchDataBills",cacheArray);
    }
    return service;

}]);
