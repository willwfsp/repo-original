/**=========================================================
 * Module: cache.js
 * Service to manage application data cache...

 =========================================================*/

App.service('CacheManager',
  ['$cacheFactory',
    function($cacheFactory){
    // Constants...
    var service = {};
    var cache = $cacheFactory("mainCache");
    var keys = ["searchDataBills"];
    // Fetches entire cache
    return {
      // DETECTION
      searchDataBills: {
        get: (function() {
            debugger;
            return cache.get("searchDataBills");
            return animationEnd && { end: animationEnd };
        })(),
        put: (function(data) {
            debugger;
            return cache.put(key, angular.isUndefined(value) ? null : value);
        })()
    }

}]);
