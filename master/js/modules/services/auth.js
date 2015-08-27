/**=========================================================
 * Module: Auth.js
 * Browser detection
 =========================================================*/

App.factory('Auth',
  ['$http','$cookieStore', '$rootScope', 
    function($http, $cookieStore, $rootScope){

    var accessLevels = routingConfig.accessLevels,
        userRoles = routingConfig.userRoles,
        currentUser = $cookieStore.get('user') || { username: '', role: userRoles.public, token: '' };

    //$cookieStore.remove('user');

    function changeUser(user) {
        angular.extend(currentUser, user);
    }

    return {
        authorize: function(accessLevel, role) {
            if(role === undefined) {
                role = currentUser.role;
            }

            return accessLevel.bitMask & role.bitMask;
        },
        isLoggedIn: function(user) {
            if(user === undefined) {
                user = currentUser;
            }
            return user.role.title === userRoles.user.title || user.role.title === userRoles.admin.title;
        },
        signup: function(user, success, error) {
            $http.post($rootScope.apiURL + 'accounts/signup', user)
            .success(function(res) { success();})
            .error(error);
        },
        login: function(user, success, error) {
            $http.post($rootScope.apiURL + 'accounts/login', user)
            .success(function(user){
                changeUser(user);
                success(user);
                $cookieStore.put('user', user);
            }).error(error);
        },
        logout: function(success, error) {
            changeUser({ username: '', role: userRoles.public, token: '' });
            $cookieStore.remove('user');
        },
        accessLevels: accessLevels,
        userRoles: userRoles,
        user: currentUser
    };
}]);

App.factory('Users',
  ['$http',
    function($http) {
        return {
            getAll: function(success, error) {
                $http.get('/users').success(success).error(error);
            }
        };
}]);
