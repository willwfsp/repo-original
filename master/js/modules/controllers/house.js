/**=========================================================
 * Module: house.js
 * Legislative Houses controller
 =========================================================*/

App.controller('HouseDataController',
  ['$scope','$rootScope', '$stateParams', '$filter', 'ngTableParams', '$log', '$http', 'DataFetcher', 'Auth',
    function($scope, $rootScope, $stateParams, $filter, ngTableParams, $log, $http, DataFetcher, Auth){
    $rootScope.$broadcast("event:show-loading");
    $scope.checkHouse = function(){
        var house = $stateParams.house;
        if (house == "CD" || house == "SF" || house == "CN"){
            return true;
        }else{
            return false;
        }
    };
    DataFetcher.fetchDataHouseDetails($stateParams.house, Auth.user.token).then(function(data){
        $log.log("houseDetails");
        $scope.houseDetails = data[0].data;
        $scope.houseEvents = data[1].data.rows;
        $scope.houseCommittees = data[2].data.rows;
        $scope.houseMembers = data[3].data.rows;

        $scope.initialLegislatureFilter = $scope.houseDetails.SLAs_LEGISLATURA;
        //parsing house events
        var aux = [];
        for(var i = 0; i < $scope.houseEvents.length; i++){

        	var evento = {};
        	evento.name = $scope.houseEvents[i].key[2];
        	evento.place = $scope.houseEvents[i].key[3];
        	evento.date = $scope.houseEvents[i].key[1];
        	aux.push(evento);
        }

        $scope.houseEvents = aux;

        //parsing committees
        aux = [];
        for(var j = 0; j < $scope.houseCommittees.length; j++){
        	var committee = {};
        	committee.name = $scope.houseCommittees[j].key[2];
        	committee.initials = $scope.houseCommittees[j].key[1];
            committee.house = $scope.houseCommittees[j].key[0];
            committee.refCode = $scope.houseCommittees[j].key[3];
        	aux.push(committee);
        }

        $scope.houseCommittees = aux;

        $scope.representativeTableParams = new ngTableParams({
            page: 1,
            count: 15,
            filter: {legislatura: $scope.initialLegislatureFilter},
            sorting: {nome: 'asc'}
        }, {
            total: $scope.houseMembers,
            counts: [],
            getData: function($defer, params){

                var filteredData = $scope.houseMembers;
                if (params.filter() ){
                    filteredData = $filter('filter')($scope.houseMembers, params.filter());
                }

                var orderedData = params.sorting() ?
                    $filter('orderBy')(filteredData, params.orderBy()) :
                    filteredData;

                params.total(orderedData.length); // set total for recalc pagination
                $defer.resolve(orderedData.slice( (params.page() - 1) * params.count(), params.page() * params.count() ) );
            }
        });

        $scope.eventsTableParams = new ngTableParams({
            page: 1,
            count: 15,
            sorting: {date: 'asc'}
        }, {
            total: $scope.houseEvents,
            counts: [],
            getData: function($defer, params){

                var filteredData = $scope.houseEvents;
                if (params.filter() ){
                    filteredData = $filter('filter')($scope.houseEvents, params.filter());
                }

                var orderedData = params.sorting() ?
                    $filter('orderBy')(filteredData, params.orderBy()) :
                    filteredData;

                params.total(orderedData.length); // set total for recalc pagination
                $defer.resolve(orderedData.slice( (params.page() - 1) * params.count(), params.page() * params.count() ) );
            }
        });

        $scope.committeesTableParams = new ngTableParams({
            page: 1,
            count: 15,
            sorting: {nome: 'asc'}
        }, {
            total: $scope.houseCommittees,
            counts: [],
            getData: function($defer, params){

                var filteredData = $scope.houseCommittees;
                if (params.filter() ){
                    filteredData = $filter('filter')($scope.houseCommittees, params.filter());
                }

                var orderedData = params.sorting() ?
                    $filter('orderBy')(filteredData, params.orderBy()) :
                    filteredData;

                params.total(orderedData.length); // set total for recalc pagination
                $defer.resolve(orderedData.slice( (params.page() - 1) * params.count(), params.page() * params.count() ) );
            }
        });

        $rootScope.$broadcast("event:dismiss-loading");
    });

}]);




