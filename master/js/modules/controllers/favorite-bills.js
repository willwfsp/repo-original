App.controller('FavoriteBillsController', ['$scope', '$log', 'DataFetcher', '$filter', '$stateParams', 'Auth', '$rootScope', 'UserFolders', '$modal', 'FoldersBills',
    function($scope, $log, DataFetcher, $filter, $stateParams, Auth, $rootScope, UserFolders, $modal, FoldersBills) {

    UserFolders.get(function(data){
        $scope.folders = data.pastas;
    });
    $scope.currentFolder = "";

    $scope.selectFolder = function(folder){
        $scope.currentFolder = folder;
        FoldersBills.get({pasta: folder}, function(data){
            $scope.bills = data.SL_PROPOSICOES;
        });
    };

    $scope.newFolder = function () {
        var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: 'newFolderController',
            resolve: {
                folders: function () {
                    return $scope.folders;
                }
            }
        });
    };

    $scope.deleteFolder = function(name){
        var index = $scope.folders.indexOf(name);
        $scope.folders.splice(index, 1);
    };

    $scope.deleteBill = function(name){
        var index = $scope.bills.indexOf(name);
        $scope.bills.splice(index, 1);
    };
}]);

App.controller('newFolderController', function ($scope, $modalInstance, folders, UserFolders) {

  $scope.foldersList = folders;
  $scope.newName = "";

  $scope.create = function () {
    if($scope.foldersList.indexOf($scope.newName) == -1){
            UserFolders.create({"pasta":$scope.newName}).$promise.then(function(){
                $scope.foldersList.push($scope.newName);
                $scope.foldersList.sort();
                $modalInstance.close();
            }, function(reason){
                $log.log(reason);
            });
        }
  };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
