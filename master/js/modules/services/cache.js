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


    /**
     * SearchBillsController cache methods
     *
     * The following methods storage and fetch the last five searches performed
     */
    service.fetchSearchDataBills = function(query){
      var cacheArray = get("searchDataBills");

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

    service.cacheSearchDataBills = function(lastQuery,dataObject) {

      var cacheArray = get("searchDataBills") ? get("searchDataBills") : [];


      for (var i=0; i < cacheArray.length; i++) {
        if (cacheArray[i].query === undefined || lastQuery === undefined) {
          return false;
        }

        if (cacheArray[i].query.toUpperCase() === lastQuery.toUpperCase()) {
          return;
        }
      }

      if (cacheArray === null || cacheArray === undefined) {
        // Init local cache array
        cacheArray = [];
      }

      cacheArray.push({query:lastQuery,data:dataObject});

      if (cacheArray.length > 5) {
        cacheArray.shift();
      };
      put("searchDataBills",cacheArray);
    }

    var fetch = function(key) {
       var cacheObject = get(key);

      if (cacheObject === null) {
        return false;
      }

      return cacheObject;
    }
    /**
     * DashboardController cache methods
     *
     * The following methods storage and fetch the DashboardController data
     */
    service.fetchHousesNews = function(){
      return fetch("housesNews");
    }

    service.cacheHousesNews = function(dataObject) {
      put("housesNews",dataObject);
    }


    /**
     * ViewDocumentsController cache methods
     *
     * The following methods storage and fetch the ViewDocumentsController data
     */
    service.fetchBillDoc = function(){
      return fetch("BillDoc");
    }

    service.cacheBillDoc = function(dataObject) {
      put("BillDoc",dataObject);
    }

    /**
     * HouseController cache methods
     *
     * The following methods storage and fetch the HouseController data
     */
    service.fetchMonthEvents = function(){
      return fetch("houseMonthEvents");
    }

    service.cacheMonthEvents = function(dataObject) {
      put("houseMonthEvents",dataObject);
    }

    service.fetchDataHouseDetails = function(){
      return fetch("dataHouseDetails");
    }

    service.cacheDataHouseDetails = function(dataObject) {
      put("dataHouseDetails",dataObject);
    }



    return service;

}]);
