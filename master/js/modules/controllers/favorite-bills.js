/**=========================================================
 * Module: favorite-bills.js
 *
 =========================================================*/

 App.controller('FavoriteController',
  ['$scope', '$log', 'DataFetcher', '$filter', '$stateParams', 'Auth', '$rootScope', 'UserFolders', '$modal', 'FoldersBills', 'ngDialog', '$state', '$stateParams', 'Notification','spinnerService',
    function($scope, $log, DataFetcher, $filter, $stateParams, Auth, $rootScope, UserFolders, $modal, FoldersBills, ngDialog, $state, $stateParams, Notification, spinnerService) {

    $rootScope.$broadcast("event:show-loading");

    UserFolders.get(function(data){
        $scope.folders = data.pastas;
        $rootScope.$broadcast("event:dismiss-loading");
    });

    $scope.createFolder = function () {
        var modalInstance = $modal.open({
            templateUrl: 'createTagModal.html',
            controller: 'CreateFolderController',
            size: 'md',
            resolve: {
                folders: function () {
                    return $scope.folders;
                }
            }
        });
        //resolve modal
        modalInstance.result.then(function (folderName) {
            $scope.currentFolder = folderName;
            FoldersBills.get({pasta: folderName}, function(data){
                $scope.bills = data.SL_PROPOSICOES;
                spinnerService.hide("ActionLoading");
                notify = $rootScope.notificationSettings;
                notify.message = 'Etiqueta criada';
                Notification.success(notify);
            });
        });
    };
}]);

App.controller('CreateFolderController',
  ['$scope', '$log', '$modalInstance', 'folders', 'UserFolders', 'spinnerService',
    function ($scope, $log, $modalInstance, folders, UserFolders, spinnerService) {

    $scope.foldersList = folders;

    $scope.create = function () {
        if($scope.createForm.$valid) {

            if($scope.foldersList.indexOf($scope.data.newName) == -1){
                spinnerService.show("ActionLoading");
                UserFolders.create({"pasta":$scope.data.newName}).$promise.then(function(){
                    $scope.foldersList.push($scope.data.newName);
                    $scope.foldersList.sort();
                    $modalInstance.close($scope.data.newName);
                }, function(reason){
                    $log.log(reason);
                });
            }

        }else{
            $scope.createForm.newName.$dirty = true;
        }

    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

App.controller('RenameFolderController',
  ['$scope', '$log', '$modalInstance', 'UserFolders', 'folders', 'folderName','spinnerService',
    function ($scope, $log, $modalInstance, UserFolders, folders, folderName, spinnerService) {

    $scope.foldersList = folders;
    $scope.folderName = folderName;
    $scope.rename = function() {
        if($scope.renameForm.$valid) {
            spinnerService.show("ActionLoading");
            if($scope.foldersList.indexOf($scope.data.newName) == -1){
                UserFolders.rename({"oldName":folderName, "newName":$scope.data.newName}).$promise.then(function(){
                    var index = folders.indexOf(folderName);
                    folders.splice(index, 1);

                    $scope.foldersList.push($scope.data.newName);
                    $scope.foldersList.sort();
                    $modalInstance.close($scope.data.newName);
                }, function(reason){
                    $log.error(reason);
                });
            }
        }else{
            $scope.renameForm.newName.$dirty = true;
        }

    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

App.controller('DeleteFolderController',
  ['$scope', '$log', '$modalInstance', 'UserFolders', 'folders', 'folderName','spinnerService',
    function ($scope, $log, $modalInstance, UserFolders, folders, folderName, spinnerService) {
    $scope.folderName = folderName;
    $scope.delete = function () {
        spinnerService.show("ActionLoading");
        UserFolders.delete({pasta: folderName}).$promise.then(function(){
            //delete folder in view
            var index = folders.indexOf(folderName);
            folders.splice(index, 1);
            $modalInstance.close();
        }, function(reason){
                $log.error(reason);
        });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);


App.controller('FavoriteBillsController',
  ['$scope', '$log', 'DataFetcher', '$filter', '$stateParams', 'Auth', '$rootScope', 'UserFolders', '$modal', 'FoldersBills', 'ngDialog', '$state', '$stateParams', 'spinnerService', 'Notification',
    function($scope, $log, DataFetcher, $filter, $stateParams, Auth, $rootScope, UserFolders, $modal, FoldersBills, ngDialog, $state, $stateParams, spinnerService, Notification) {

    spinnerService.show("ActionLoading");
    $scope.showDefault = true;

    if($stateParams.folderName){
        FoldersBills.get({pasta: $stateParams.folderName}, function(data){
            $scope.bills = data.SL_PROPOSICOES;
            spinnerService.hide("ActionLoading");
        });
        $scope.currentFolder = $stateParams.folderName;
        $scope.showDefault = false;
    }else{
        spinnerService.hide("ActionLoading");
        $scope.showDefault = true;
    }


    $scope.renameFolder = function () {
        var modalInstance = $modal.open({
            templateUrl: 'renameTagModal.html',
            controller: 'RenameFolderController',
            size: 'md',
            resolve: {
                folders: function () {
                    return $scope.folders;
                },
                folderName: function(){
                    return $scope.currentFolder;
                }
            }
        });
        //resolve modal
        modalInstance.result.then(function (folderName) {
            spinnerService.hide("ActionLoading");
            $state.go('app.favorites.folder', {'folderName': folderName })
            notify = $rootScope.notificationSettings;
            notify.message = 'Etiqueta renomeada';
            Notification.success(notify);
        });
    };

    $scope.deleteFolder = function(name){
        var modalInstance = $modal.open({
            templateUrl: 'deleteTagModal.html',
            controller: 'DeleteFolderController',
            size: 'md',
            resolve: {
                folders: function () {
                    return $scope.folders;
                },
                folderName: function(){
                    return $scope.currentFolder;
                }
            }
        });
        //resolve modal
        modalInstance.result.then(function (selectedItem) {

            $scope.currentFolder = '';
            $scope.showDefault = true;
            spinnerService.hide("ActionLoading");
            notify = $rootScope.notificationSettings;
            notify.message = 'Etiqueta removida';
            Notification.success(notify);
        });
    };

    /* Author Filter*/
    $scope.parseAuthor = function(authorString){
        var author = {};
            try{
                author = authorString.split(",#");
            }
            catch(err){
                return authorString;
            }
            return {"name": author[0], "id": author[1]};
    };

    $scope.getMainAuthor = function(data){
        //if only one author
        if (typeof(data) == "string"){
            return $scope.parseAuthor(data);
        }
        //if array, return last author in array, who is the main author
        else if (data instanceof Array){
            return $scope.parseAuthor(data[data.length - 1]);
        }
        else{
            return "";
        }
    };

    $scope.hasCoauthors = function(billMainAuthor){
        if(billMainAuthor instanceof Array){
            if(billMainAuthor.length > 1){
               return true;
            }

        }
        return false;
    };

    $scope.removeBill = function(bill){
        spinnerService.show("ActionLoading");
        findObj = {};
        findObj.SLP_NOME = bill;
        var myObject = {};
        myObject.proposicoesNovas = [];
        myObject.proposicoesVelhas = [];
        myObject.proposicoesVelhas.push(bill)
        FoldersBills.update({pasta: $scope.currentFolder}, myObject, function(data){
            $scope.bills.splice(_.findIndex($scope.bills, findObj), 1);
            spinnerService.hide("ActionLoading");
            notify = $rootScope.notificationSettings;
            notify.message = 'Projeto de lei removido';
            Notification.success(notify);
        }, function(error) {
            spinnerService.hide("ActionLoading");
            notify = $rootScope.notificationSettings;
            notify.message = 'Erro. Tente novamente.';
            Notification.error(notify);
        });
    };
}]);

