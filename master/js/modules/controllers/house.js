/**=========================================================
 * Module: house.js
 * Legislative Houses controller
 =========================================================*/

App.controller('HouseDataController',
  ['$scope','$rootScope', '$stateParams', '$filter', 'ngTableParams', '$log', '$http', 'DataFetcher', 'Auth', '$modal',
    function($scope, $rootScope, $stateParams, $filter, ngTableParams, $log, $http, DataFetcher, Auth, $modal){
    $rootScope.$broadcast("event:show-loading");
    $scope.checkHouse = function(){
        var house = $stateParams.house;
        if (house == "CD" || house == "SF" || house == "CN"){
            return true;
        }else{
            return false;
        }
    };

    $scope.showEvent = function(event){
        $modal.open({
            templateUrl: 'modalContent.html',
            controller: ['$scope', '$log', function($scope, $log){
                $scope.event = event;
            }]
        });
    };

    $scope.calendarDay = new Date();
    $scope.calendarView = 'week';
    $scope.events = [];
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

            $scope.events[i] = {
                title: evento.name, // The title of the event
                type: 'success', // The type of the event (determines its color). Can be important, warning, info, inverse, success or special
                startsAt: new Date(evento.date), // A javascript date object for when the event starts
                //endsAt: new Date(2015,8,8), // Optional - a javascript date object for when the event ends
                editable: false, // If edit-event-html is set and this field is explicitly set to false then dont make it editable.
                deletable: false, // If delete-event-html is set and this field is explicitly set to false then dont make it deleteable
                draggable: false, //Allow an event to be dragged and dropped
                resizable: false, //Allow an event to be resizable
                incrementsBadgeTotal: true, //If set to false then will not count towards the badge total amount on the month and year view
                cssClass: 'text-center', //A CSS class (or more, just separate with spaces) that will be added to the event when it is displayed on each view. Useful for marking an event as selected / active etc
            };
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




