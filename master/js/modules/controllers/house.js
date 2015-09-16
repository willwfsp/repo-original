/**=========================================================
 * Module: house.js
 * Legislative Houses controller
 =========================================================*/

App.controller('HouseDataController',
  ['$scope','$rootScope', '$stateParams', '$filter', 'ngTableParams', '$log', '$http', 'DataFetcher', 'Auth', '$modal','$compile', 'uiCalendarConfig',
    function($scope, $rootScope, $stateParams, $filter, ngTableParams, $log, $http, DataFetcher, Auth, $modal,$compile, uiCalendarConfig){
    $rootScope.$broadcast("event:show-loading");

    // function to check if it's a state house, don't show 'state' column on ngTableParams
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
                $scope.dismiss = function() {
                        $scope.$dismiss();
                };
            }]
        });
    };

    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
    /* event source that pulls from google.com */
    /* event source that contains custom events on the scope */
    $scope.events = [];
    /* event source that calls a function on every view switch */
    $scope.eventsF = function (start, end, timezone, callback) {
        var s = new Date(start).getTime() / 1000;
        var e = new Date(end).getTime() / 1000;
        var m = new Date(start).getMonth();
        var events = [{title: 'Feed Me ' + m,start: s + (50000),end: s + (100000),allDay: false, className: ['customFeed']}];
        callback(events);
    };
    /* alert on eventClick */
    $scope.alertOnEventClick = function( date, jsEvent, view){
        $scope.alertMessage = (date);
    };
    /* add and removes an event source of choice */
    $scope.addRemoveEventSource = function(sources,source) {
        var canAdd = 0;
        angular.forEach(sources,function(value, key){
            if(sources[key] === source){
                sources.splice(key,1);
                canAdd = 1;
            }
        });
        if(canAdd === 0){
            sources.push(source);
        }
    };
     /* Render Tooltip */
    $scope.eventRender = function( event, element, view ) {
        element.attr({'tooltip': event.title,
                             'tooltip-append-to-body': true});
        $compile(element)($scope);
    };
    /* config object */
    $scope.uiConfig = {
        calendar: {
            height: '100%',
            editable: false,
            header:{
                left: '',
                center: 'title',
                right: ''
            },
        eventClick: $scope.showEvent,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize,
        eventRender: $scope.eventRender
        }
    };
    /* event sources array*/
    $scope.eventSources = [$scope.events];
    DataFetcher.fetchMonthEvents($stateParams.house, Auth.user.token).then(function(data){
        console.log(data);
        for(var i = 0; i < data.length; i++){
            var evento = {};
            evento.title = data[i].SLEv_TITULO;
            evento.start = data[i].SLEv_DATA_INI;
            evento.place = data[i].SLEv_LOCAL;
            if(data[i].SLEv_DATA_FIM){
                evento.end = data[i].SLEv_DATA_FIM;
            }
            if(data[i].SLEv_LINK_DETALHES){
                evento.details = data[i].SLEv_LINK_DETALHES;
            }
            $scope.events.push(evento);
        }
    });

    DataFetcher.fetchDataHouseDetails($stateParams.house, Auth.user.token).then(function(data){
        $scope.houseDetails = data[0].data;
        $scope.houseCommittees = data[1].data.rows;
        $scope.houseMembers = data[2].data.rows;

        $scope.initialLegislatureFilter = $scope.houseDetails.SLAs_LEGISLATURA;

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




