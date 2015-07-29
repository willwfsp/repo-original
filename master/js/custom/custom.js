// To run this code, edit file 
// index.html or index.jade and change
// html data-ng-app attribute from
// angle to myAppName
// ----------------------------------- 

var myApp = angular.module('SigaLeiApp', ['angle', 'ngDialog']);

myApp.run(["$log", function($log) {

  $log.log('I\'m a line from custom.js');

}]);

myApp.config(["RouteHelpersProvider", function(RouteHelpersProvider) {

  // Custom Route definition
  
}]);

myApp.controller('oneOfMyOwnController', ["$scope", function($scope) {
  /* controller code */
}]);

myApp.directive('oneOfMyOwnDirectives', function() {
  /*directive code*/
});

myApp.config(["$stateProvider", 'RouteHelpersProvider', function($stateProvider, helper) {
  /* specific routes here (see file config.js) */
  $stateProvider
    .state('app.congresso_nacional', {
        url: '/congresso_nacional',
        title: 'Congresso Nacional',
        templateUrl: helper.basepath('congresso_nacional.html')
    })
    .state('app.camara_deputados', {
        url: '/camara_deputados',
        title: 'Câmara dos Deputados',
        templateUrl: helper.basepath('camara_deputados.html')
    })
    .state('app.senado_federal', {
        url: '/senado_federal',
        title: 'Senado Federal',
        templateUrl: helper.basepath('senado_federal.html')
    })
    .state('app.proposicao', {
        url: '/proposicao',
        title: 'Visualizar Projeto de Lei',
        templateUrl: helper.basepath('proposicao.html')
    })
    .state('app.parlamentar', {
        url: '/parlamentar',
        title: 'Visualizar dados de parlamentares',
        templateUrl: helper.basepath('parlamentar.html')
    })
    .state('app.search', {
        url: '/search?q',
        title: 'Pesquisar',
        templateUrl: helper.basepath('search.html'),
        params: {
            q: ""
        }
    })
    .state('app.calendar', {
        url: '/calendar',
        title: 'Calendários',
        templateUrl: helper.basepath('calendar.html')
    })
    .state('page', {
        url: '/page',
        templateUrl: 'app/pages/page.html',
        resolve: helper.resolveFor('modernizr', 'icons'),
        controller: ["$rootScope", function($rootScope) {
            $rootScope.app.layout.isBoxed = false;
        }]
    })
    .state('page.login', {
        url: '/login',
        title: 'Login',
        templateUrl: 'app/pages/login.html'
    })
    ;

}]);