App.factory('UserSettings', ['$resource', '$rootScope', 'Auth', function ($resource, $rootScope, Auth) {
    return $resource($rootScope.apiURL + 'usuarios/perfil/:field', {}, {
            get: {
                method:"GET",
                headers: {'Authorization': 'Bearer ' + Auth.user.token}
            },
            changeSettings: {
                method:"PUT",
                headers: {'Authorization': 'Bearer ' + Auth.user.token}
            },
            changePassword: {
                method:"PUT",
                headers: {'Authorization': 'Bearer ' + Auth.user.token}
            }
    });
}]);

App.factory('UserFolders', ['$resource', '$rootScope', 'Auth', function ($resource, $rootScope, Auth) {
    return $resource($rootScope.apiURL + 'usuarios/favoritos/pastas/:pasta', {}, {
            get: {
                method:"GET",
                headers: {'Authorization': 'Bearer ' + Auth.user.token}
            },
            create: {
                method:"POST",
                headers: {'Authorization': 'Bearer ' + Auth.user.token}
            },
            rename: {
                method:"PUT",
                headers: {'Authorization': 'Bearer ' + Auth.user.token}
            },
            delete: {
                method:"DELETE",
                headers: {'Authorization': 'Bearer ' + Auth.user.token}
            }
    });
}]);

App.factory('FoldersBills', ['$resource', '$rootScope', 'Auth', '$http',
    function ($resource, $rootScope, Auth, $http) {
    $http.defaults.headers['Access-Control-Allow-Origin'] = '*';
    $http.defaults.headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS, PUT';
    return $resource($rootScope.apiURL + 'usuarios/favoritos/:pasta/proposicoes', {}, {
            get: {
                method:"GET",
                headers: {'Authorization': 'Bearer ' + Auth.user.token}
            },
            save: {
                method:"POST",
                headers: {'Authorization': 'Bearer ' + Auth.user.token}
            },
            update:{
                method:"PUT",
                headers: {'Authorization': 'Bearer ' + Auth.user.token}
            }
    });
}]);

App.factory('BillComments', ['$resource', '$rootScope', 'Auth', function ($resource, $rootScope, Auth) {
    return $resource($rootScope.apiURL + 'usuarios/comentarios/:comentario', {}, {
            get: {
                method:"GET",
                headers: {'Authorization': 'Bearer ' + Auth.user.token}
            },
            save: {
                method:"POST",
                headers: {'Authorization': 'Bearer ' + Auth.user.token}
            },
            edit:{
                method:"PUT",
                headers: {'Authorization': 'Bearer ' + Auth.user.token}
            },
            delete:{
                method:"DELETE",
                headers: {'Authorization': 'Bearer ' + Auth.user.token}
            }
    });
}]);
