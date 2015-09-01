/**=========================================================
 * Module: bill.js
 * Bills Details
 =========================================================*/

App.controller('BillController',
  ['$location', '$scope','$state', '$stateParams', '$log', '$http', '$filter', '$window',
   'ngTableParams', 'DataFetcher', 'Auth', 'ngDialog', '$document', 'spinnerService','UserFolders','FoldersBills', '$rootScope',
    function($location,$scope, $state, $stateParams, $log, $http, $filter, $window,
        ngTableParams, DataFetcher, Auth, ngDialog, $document, spinnerService, UserFolders,FoldersBills, $rootScope){

    $scope.coAuthorsCollapsed = true;
    $scope.dados = {};
    $rootScope.$broadcast("event:show-loading");
    $scope.viewDoc = function(url, house){
        if(!house){
            $window.open(url, '_blank');
        }
        else{
            var parsedUrl = url.replace(DataFetcher.getApiMgEndPoint() + '/proposicoes/pesquisa/avancada?expr=', "");
            console.log(parsedUrl);
            $state.go('app.viewDocuments', {docUrl: parsedUrl} );
        }
    };

    $scope.docsTableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {SLD_DATA: 'des'}
    }, {
        total: $scope.dados.SLP_DOCUMENTOS,
        counts: [],
        getData: function($defer, params){

            var filteredData = $scope.dados.SLP_DOCUMENTOS;
            if (params.filter() ){
                filteredData = $filter('filter')($scope.dados.SLP_DOCUMENTOS, params.filter());
            }

            var orderedData = params.sorting() ?
                $filter('orderBy')(filteredData, params.orderBy()) :
                filteredData;

            params.total(orderedData.length); // set total for recalc pagination
            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
    });



    DataFetcher.fetchBill($stateParams.billName, Auth.user.token).then(function(data) {
        $scope.dados = data[0].data;
        $scope.tracksBill = data[1].data;
        $scope.billVotingList = data[2].data;
        $scope.docsTableParams.reload();
        $scope.tagsModel.data = [];
        if($scope.dados.hasOwnProperty('USER_TAGS')){
            $scope.dados.USER_TAGS.forEach(function(item){
                $scope.tagsModel.data.push({id:item})
            });
        }
        $rootScope.$broadcast("event:dismiss-loading");


   });

    $scope.follow = function(){
        ngDialog.open({
              template: '<h2>Notice that there is no overlay!</h2>',
              className: 'ngdialog-theme-default',
              plain: true,
              overlay: false
            });
        if($scope.dados.hasOwnProperty('following')){
            $scope.dados.following = !$scope.dados.following
        }else{
            $scope.dados.following = true;
        }
    }

    /* Tags Handler*/
    $document.on('click', function (e) {
        var target = e.target.parentElement;
        var parentFound = false;

        while (angular.isDefined(target) && target !== null && !parentFound) {
            if (_.contains(target.className.split(' '), 'multiselect-parent') && !parentFound) {
                $dropdownTrigger = angular.element("#DropdownTagsList")[0]
                if(target.id === $dropdownTrigger.id) {
                    parentFound = true;
                }
            }
            target = target.parentElement;
        }

        if (!parentFound) {
            $scope.$apply(function () {
                $scope.open = false;

            });
        }
    });



    function getFindObj(id) {
        var findObj = {};

        findObj[$scope.tagsSettings.idProp] = id;

        return findObj;
    }

    function clearObject(object) {
        for (var prop in object) {
            delete object[prop];
        }
    }

    $scope.toggleDropdown = function(){
        spinnerService.show("ActionLoading");
        $scope.tagsData = {};
        if(!$scope.open){
            $scope.tagsData.data = [];
            UserFolders.get(function(data){
                data.pastas.forEach(function(item){
                    var AuxObject = {};
                    AuxObject.id = item;
                    $scope.tagsData.data.push(AuxObject)

                });
                spinnerService.hide("ActionLoading");
                $scope.open = !$scope.open;
            });

        }else{
            spinnerService.hide("ActionLoading");
            $scope.open = !$scope.open;
        }


    }

    $scope.getPropertyForObject = function (object, property) {
        if (angular.isDefined(object) && object.hasOwnProperty(property)) {
            return object[property];
        }

        return '';
    };

    $scope.setSelectedItem = function (id, bill, dontRemove) {
        spinnerService.show("ActionLoading");
        var findObj = getFindObj(id);
        var finalObj = null;

        finalObj = _.find($scope.tagsData.data, findObj);

        dontRemove = dontRemove || false;

        var exists = _.findIndex($scope.tagsModel.data, findObj) !== -1;

        if (!dontRemove && exists) {
            var myObject = {};
            myObject.proposicoesNovas = [];
            myObject.proposicoesVelhas = [];
            myObject.proposicoesVelhas.push(bill)
            FoldersBills.update({pasta: id}, myObject, function(data){
                $scope.tagsModel.data.splice(_.findIndex($scope.tagsModel.data, findObj), 1);
                $scope.externalEvents.onItemDeselect(findObj);
                spinnerService.hide("ActionLoading");
            });


        } else if (!exists) {
            var myObject = {};
            myObject.proposicoesNovas = [];
            myObject.proposicoesVelhas = [];
            myObject.proposicoesNovas.push(bill)
            FoldersBills.update({pasta: id}, myObject, function(data){
                $scope.tagsModel.data.push(finalObj);
                $scope.externalEvents.onItemSelect(finalObj);
                spinnerService.hide("ActionLoading");
            });

        }

    };
    $scope.isChecked = function (id) {
        return _.findIndex($scope.tagsModel.data, getFindObj(id)) !== -1;
    };

    $scope.createTag = function(tag, bill){
        spinnerService.show("ActionLoading");
        var myObject = {};
        myObject.proposicoes = [];
        myObject.proposicoes.push(bill)
        FoldersBills.save({pasta: tag}, myObject, function(data){
            var AuxObject = {};
            AuxObject.id = tag;
            $scope.tagsData.data.push(AuxObject);
            $scope.tagsModel.data.push({id:tag});
            $scope.externalEvents.onItemSelect({id:tag});
            spinnerService.hide("ActionLoading");
        });

    }
    $scope.initVariables = function(){
        $scope.open = false;
        $scope.tagsModel = {};
        $scope.tagsData = {};
    }

    $scope.removeTag = function(id, bill){
        spinnerService.show("ActionLoading");
        var findObj = getFindObj(id);
        var myObject = {};
        myObject.proposicoesNovas = [];
        myObject.proposicoesVelhas = [];
        myObject.proposicoesVelhas.push(bill)
        FoldersBills.update({pasta: id}, myObject, function(data){
            $scope.tagsModel.data.splice(_.findIndex($scope.tagsModel.data, findObj), 1);
            spinnerService.hide("ActionLoading");
        });

    }

    $scope.externalEvents = {
        onItemSelect: angular.noop,
        onItemDeselect: angular.noop,
        onSelectAll: angular.noop,
        onDeselectAll: angular.noop,
        onInitDone: angular.noop,
        onMaxSelectionReached: angular.noop
    };

    $scope.tagsSettings = {
        dynamicTitle: false,
        displayProp: 'label',
        idProp: 'id',
        enableSearch: true,
        showCheckAll: false,
        showUncheckAll: false,
        scrollableHeight: '200',
        smartButtonMaxItems: 1,
    };

}]);

App.controller('PollDetailsController', ['$scope', '$log', 'DataFetcher', '$filter', '$stateParams', 'ngTableParams', 'Auth',
    function($scope, $log, DataFetcher, $filter, $stateParams, ngTableParams, Auth) {

    $scope.pollData = {};
    $scope.pollResults = [];

    $scope.dismiss = function() {
        $scope.$dismiss();
    };

    $scope.pollTableParams = new ngTableParams({
            page: 1,
            count: 10,
            sorting: {PARLAMENTAR_NOME: 'asc'}
        }, {
            total: $scope.pollResults.length,
            counts: [],
            getData: function($defer, params){

                var filteredData = $scope.pollResults;
                if (params.filter() ){
                    filteredData = $filter('filter')($scope.pollResults, params.filter());
                }

                var orderedData = params.sorting() ?
                    $filter('orderBy')(filteredData, params.orderBy()) :
                    filteredData;

                params.total(orderedData.length); // set total for recalc pagination
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()) );
            }
    });

    DataFetcher.fetchDataPollDetails($stateParams.pollID, Auth.user.token).then(function(data) {
        $scope.pollData = data;
        $scope.pollResults = data.SLV_VOTOS;
        $scope.pollTableParams.reload();
    });
}]);
