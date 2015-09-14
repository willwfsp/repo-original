 /**=========================================================
 * Module: settings.js
 *
 =========================================================*/
 App.controller('SettingsController',
  ['$scope', '$log', 'DataFetcher', '$filter', '$stateParams', 'Auth', '$rootScope', 'UserFolders', '$modal', 'FoldersBills', 'ngDialog', 'Notification','spinnerService',
    function($scope, $log, DataFetcher, $filter, $stateParams, Auth, $rootScope, UserFolders, $modal, FoldersBills, ngDialog, Notification, spinnerService) {
        $scope.user = Auth.user;
}]);
