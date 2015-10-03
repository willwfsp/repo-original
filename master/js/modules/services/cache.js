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

    var fetch = function(key) {
       var cacheObject = get(key);

      if (cacheObject === null) {
        return false;
      }

      return cacheObject;
    }

    var fetchInMultiCache = function(key, query){
      var cacheArray = get(key);

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

    // Creates a cache thats allows queue an especific number of different data
    var multiCache = function(maxLimit, key, lastQuery, dataObject){
      var cacheArray = get(key) ? get(key) : [];


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

      if (cacheArray.length > maxLimit) {
        cacheArray.shift();
      };
      put(key,cacheArray);
    }


    /**
     * SearchBillsController cache methods
     *
     * The following methods storage and fetch the last five searches performed
     */
    service.fetchSearchDataBills = function(query){
      return fetchInMultiCache("searchDataBills", query);

    }

    service.cacheSearchDataBills = function(lastQuery,dataObject) {
      return multiCache(5, "searchDataBills", lastQuery, dataObject);
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
    service.fetchBillDoc = function(query){
      return fetch("billDoc" + query);
    }

    service.cacheBillDoc = function(query, dataObject) {
      put("billDoc" + query,dataObject);
    }

    /**
     * HouseController cache methods
     *
     * The following methods storage and fetch the HouseController data
     */
    service.fetchMonthEvents = function(query){
      return fetch("events"+query);
    }

    service.cacheMonthEvents = function(query, dataObject) {
      put("events"+ query,dataObject);
    }

    service.fetchDataHouseDetails = function(query){
      return fetch("houseDetails"+query);
    }

    service.cacheDataHouseDetails = function(query, dataObject) {
      put("houseDetails"+query,dataObject);
    }


    /**
     * RepresentativeDataController cache methods
     *
     * The following methods storage and fetch the last five searches performed
     */
    service.fetchDataRepresentative = function(query){
      return fetchInMultiCache("representativeData", query);

    }

    service.cacheDataRepresentative = function(lastQuery,dataObject) {
      return multiCache(5, "representativeData", lastQuery, dataObject);
    }

    /**
     * CommitteesController cache methods
     *
     * The following methods storage and fetch the last five searches performed
     */
    service.fetchCommitteeDetails = function(query){
      return fetchInMultiCache("committesData", query);

    }

    service.cacheCommittees = function(lastQuery,dataObject) {
      return multiCache(5, "committesData", lastQuery, dataObject);
    }


    /**
     * PollDetailsController cache methods
     *
     * The following methods storage and fetch the searches performed
     */

    service.fetchPollDetails = function(query){
      return fetch("pollDetails"+query);
    }

    service.cachePollDetails = function(query, dataObject) {
      put("pollDetails"+query,dataObject);
    }


    return service;

}]);
