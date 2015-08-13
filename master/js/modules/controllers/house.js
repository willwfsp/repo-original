/**=========================================================
 * Module: house.js
 * Legislative Houses controller
 =========================================================*/

App.controller('HouseDataController',
  ['$scope','$rootScope', '$stateParams', '$filter', 'ngTableParams', '$log', '$http', 'DataFetcher',
    function($scope, $rootScope, $stateParams, $filter, ngTableParams, $log, $http, DataFetcher){

    $scope.houseMembers = [];
	$scope.houseEvents = [];
	$scope.houseCommittees = [];

    $scope.representativeTableParams = new ngTableParams({
        page: 1,
        count: 15,
        filter: {legislatura: '55'},
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

    DataFetcher.fetchDataHouseDetails($stateParams.house).then(function(data){
        $log.log("houseDetails");
        $scope.houseDetails = data[0].data;
        $scope.houseEvents = data[1].data.rows;
        $scope.houseCommittees = data[2].data.rows;
        $scope.houseMembers = data[3].data.rows;

        //parsing house events
        var aux = [];
        for(var i = 0; i < $scope.houseEvents.length; i++){

        	var evento = {};
        	evento.name = $scope.houseEvents[i].key[4];
        	evento.place = $scope.houseEvents[i].key[3];
        	evento.date = $scope.houseEvents[i].key[1];
        	aux.push(evento);
        };

        $scope.houseEvents = aux;

        //parsing committees
        aux = [];
        for(var i = 0; i < $scope.houseCommittees.length; i++){
        	var committee = {};
        	committee.name = $scope.houseCommittees[i].key[2];
        	committee.initials = $scope.houseCommittees[i].key[1];
            committee.house = $scope.houseCommittees[i].key[0];
            committee.refCode = $scope.houseCommittees[i].key[3];
        	aux.push(committee);
        };

        $scope.houseCommittees = aux;

        //reloading tables
        $scope.representativeTableParams.reload();
        $scope.eventsTableParams.reload();
        $scope.committeesTableParams.reload();
    });

}]);




