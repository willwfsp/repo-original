/**=========================================================
 * Module: favorite-bills.js
 *
 =========================================================*/

 App.controller('FavoriteController',
  ['$scope', '$log', 'DataFetcher', '$filter', '$stateParams', 'Auth', '$rootScope', 'UserFolders', '$modal', 'FoldersBills', 'ngDialog', '$state', '$stateParams',
    function($scope, $log, DataFetcher, $filter, $stateParams, Auth, $rootScope, UserFolders, $modal, FoldersBills, ngDialog, $state, $stateParams) {


    UserFolders.get(function(data){
        $scope.folders = data.pastas;
    });



    $scope.selectFolder = function(folder){
        $scope.currentFolder = folder;
        FoldersBills.get({pasta: folder}, function(data){
            $scope.bills = data.SL_PROPOSICOES;
        });
    };

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
            });
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
}]);

App.controller('CreateFolderController',
  ['$scope', '$log', '$modalInstance', 'folders', 'UserFolders',
    function ($scope, $log, $modalInstance, folders, UserFolders) {

    $scope.foldersList = folders;
    $scope.newName = "";

    $scope.create = function () {
        if($scope.foldersList.indexOf($scope.newName) == -1){
            UserFolders.create({"pasta":$scope.newName}).$promise.then(function(){
                $scope.foldersList.push($scope.newName);
                $scope.foldersList.sort();
                $modalInstance.close($scope.newName);
            }, function(reason){
                $log.log(reason);
            });
        }
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

App.controller('RenameFolderController',
  ['$scope', '$log', '$modalInstance', 'UserFolders', 'folders', 'folderName' ,
    function ($scope, $log, $modalInstance, UserFolders, folders, folderName) {

    $scope.foldersList = folders;
    $scope.newName = "";

    $scope.rename = function () {
        if($scope.foldersList.indexOf($scope.newName) == -1){
            UserFolders.rename({"oldName":folderName, "newName":$scope.newName}).$promise.then(function(){
                var index = folders.indexOf(folderName);
                folders.splice(index, 1);

                $scope.foldersList.push($scope.newName);
                $scope.foldersList.sort();
                $modalInstance.close($scope.newName);
            }, function(reason){
                $log.error(reason);
            });
        }
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

App.controller('DeleteFolderController',
  ['$scope', '$log', '$modalInstance', 'UserFolders', 'folders', 'folderName',
    function ($scope, $log, $modalInstance, UserFolders, folders, folderName) {
    $scope.folderName = folderName;
    $scope.delete = function () {
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
  ['$scope', '$log', 'DataFetcher', '$filter', '$stateParams', 'Auth', '$rootScope', 'UserFolders', '$modal', 'FoldersBills', 'ngDialog', '$state', '$stateParams',
    function($scope, $log, DataFetcher, $filter, $stateParams, Auth, $rootScope, UserFolders, $modal, FoldersBills, ngDialog, $state, $stateParams) {

    $scope.showDefault = true;
    if($stateParams.folderName){
        FoldersBills.get({pasta: $stateParams.folderName}, function(data){
            $scope.bills = data.SL_PROPOSICOES;
        });
        $scope.currentFolder = $stateParams.folderName;
        $scope.showDefault = false;
    }else{
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
            $state.go('app.favorites.folder', {'folderName': folderName })
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
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.deleteBill = function(name){
        var index = $scope.bills.indexOf(name);
        $scope.bills.splice(index, 1);
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
        console.log("ok");
        findObj = {};
        findObj.SLP_NOME = bill;
        var myObject = {};
        myObject.proposicoesNovas = [];
        myObject.proposicoesVelhas = [];
        myObject.proposicoesVelhas.push(bill)
        FoldersBills.update({pasta: $scope.currentFolder}, myObject, function(data){
            $scope.bills.splice(_.findIndex($scope.bills, findObj), 1);

        });
    };
}]);

