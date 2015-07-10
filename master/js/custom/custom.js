// To run this code, edit file 
// index.html or index.jade and change
// html data-ng-app attribute from
// angle to myAppName
// ----------------------------------- 

var myApp = angular.module('SigaLeiApp', ['angle', 'infinite-scroll']);

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
    ;

}]);