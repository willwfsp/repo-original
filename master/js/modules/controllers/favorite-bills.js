App.controller('FavoriteBillsController', ['$scope', '$log', 'DataFetcher', '$filter', '$stateParams', 'Auth', '$rootScope', 'UserFolders', '$modal', 'FoldersBills', 'ngDialog', '$state', '$stateParams',
    function($scope, $log, DataFetcher, $filter, $stateParams, Auth, $rootScope, UserFolders, $modal, FoldersBills, ngDialog, $state, $stateParams) {
    
    $scope.currentFolder = $stateParams.folderName;

    UserFolders.get(function(data){
        $scope.folders = data.pastas;
    });
    
    FoldersBills.get({pasta: $scope.currentFolder}, function(data){
        $scope.bills = data.SL_PROPOSICOES;
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
            $scope.currentFolder = folderName;

            FoldersBills.get({pasta: folderName}, function(data){
                $scope.bills = data.SL_PROPOSICOES;
            });
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
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
            $scope.currentFolder = "";
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.deleteBill = function(name){
        var index = $scope.bills.indexOf(name);
        $scope.bills.splice(index, 1);
    };
    $scope.status = {
        isopen: false
    };
    $scope.toggleDropdown = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.status.isopen = !$scope.status.isopen;
    };
}]);

App.controller('CreateFolderController', function ($scope, $log, $modalInstance, folders, UserFolders) {

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
});

App.controller('RenameFolderController', function ($scope, $log, $modalInstance, UserFolders, folders, folderName) {

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
                $log.log(reason);
            });
        }
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

App.controller('DeleteFolderController', function ($scope, $log, $modalInstance, UserFolders, folders, folderName) {
    $scope.folderName = folderName;
    $scope.delete = function () {
        UserFolders.delete({pasta: folderName}).$promise.then(function(){
            //delete folder in view
            var index = folders.indexOf(folderName);
            folders.splice(index, 1);
            $modalInstance.close();
        }, function(reason){
                $log.log(reason);
        });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

