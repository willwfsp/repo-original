/**=========================================================
 * Module: profile.js
 *
 =========================================================*/

 App.controller('ProfileController',
    ['$q', '$rootScope', '$scope', '$log', 'Auth', 'DataFetcher', 'UserSettings',
    function($q, $rootScope, $scope, $log, Auth, DataFetcher, UserSettings){

    $rootScope.$broadcast("event:show-loading");
    $scope.changeMessage= '';
    UserSettings.get(function(data){
        $scope.user = data;
        $scope.firstname=data.firstname;
        $scope.lastname=data.lastname;
        $scope.organization=data.organization;
        $scope.phone = data.telephone;
        if(data.emailDigestPeriod){
            $scope.emailDigestPeriod = data.emailDigestPeriod;
        }
        else{
            $scope.emailDigestPeriod = 24;
        }
        $rootScope.$broadcast("event:dismiss-loading");
    });

    $scope.mask = '(99) 9999-9999?9';
    $scope.$watch('phone', function() {
        try{
            if($scope.phone.length === 11)
                $scope.mask =  '(99) ?99999-9999';
            else
                $scope.mask = '(99) 9999-9999?9';
        }
        catch(e){

        }
    });

    $scope.update = function(){
        var newUserSettings = {};
        newUserSettings.firstname = $scope.firstname;
        newUserSettings.lastname = $scope.lastname;
        newUserSettings.organization = $scope.organization;
        if($scope.phone){
            newUserSettings.telephone = $scope.phone;
        }
        else{
            newUserSettings.telephone = "";
        }
        newUserSettings.emailDigestPeriod = parseInt($scope.emailDigestPeriod);
        $log.log(newUserSettings);
        $scope.showLoading = true;

        UserSettings.changeSettings(JSON.stringify(newUserSettings) ).$promise.then(function(){
            $scope.changeMessage = "Alterações realizadas com sucesso!";
            $scope.changeSuccess = true;
            $scope.showLoading = false;
        }, function(reason){
            $scope.changeMessage = "Não foi possível fazer suas alterações.";
            $scope.changeSuccess = false;
            $scope.showLoading = false;
        });
    };
}]);

App.controller('ChangePasswordController',
    ['$q', '$rootScope', '$scope', '$log', 'Auth', 'DataFetcher', 'UserSettings',
    function($q, $rootScope, $scope, $log, Auth, DataFetcher, UserSettings){

    $scope.changePassword = function(){
        $scope.showLoading = true;
        UserSettings.changeSettings({field: 'senha'}, { "oldPassword": $scope.old_password, "newPassword": $scope.new_password } ).$promise.then(function(){
            $scope.changeMessage = "Senha trocada com sucesso!";
            $scope.changeSuccess = true;
            $scope.showLoading = false;
        }, function(reason){
            $scope.changeMessage = "Não foi possível trocar sua senha.";
            $log.log(reason);
            if(reason.data.error == "putProfileSenha: wrong password"){
                $scope.changeMessage+=" Senha antiga incorreta.";
            }
            $scope.changeSuccess = false;
            $scope.showLoading = false;
        });
    };
}]);
