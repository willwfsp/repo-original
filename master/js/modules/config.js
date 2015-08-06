/**=========================================================
 * Module: config.js
 * App routes and resources configuration
 =========================================================*/

App.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
  'use strict';

  // Set the following to true to enable the HTML5 Mode
  // You may have to set <base> tag in index and a routing configuration in your server
  $locationProvider.html5Mode(false);

  // default route
  $urlRouterProvider.otherwise('/app/dashboard');

  //
  // Application Routes
  // -----------------------------------
  $stateProvider
    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: helper.basepath('app.html'),
        controller: 'AppController',
        resolve: helper.resolveFor('modernizr', 'icons', 'loaders.css', 'spinkit')
    })
    .state('app.dashBoard', {
        url: '/dashboard',
        title: 'Página Principal',
        templateUrl: helper.basepath('dashboard.html')
    })
    .state('app.searchBills', {
        url: '/searchBills?q',
        title: 'Pesquisar Proposições',
        templateUrl: helper.basepath('searchBills.html'),
        resolve: helper.resolveFor('select', 'ui.select'),
        controller: 'SearchBillsController'
    })
    .state('app.bill', {
        url: '/bill/:billName',
        title: 'Visualizar Projeto de Lei',
        templateUrl: helper.basepath('bill.html'),
        resolve: helper.resolveFor('ngTable'),
        controller: 'BillController'
    })
    .state('app.proposicao.pollDetails', {
        url: '/pollDetails/{pollID}',
        title: 'Visualizar detalhes da votação',
        onEnter: ['$stateParams', '$state', '$modal', '$resource', function($stateParams, $state, $modal, $resource) {
          $modal.open({
            templateUrl: helper.basepath('pollDetails.html'),
            controller: 'PollDetailsController'
          }).result.finally(function() {
              $state.go('^');
          });
        }]
    })
    .state('app.representative', {
        url: '/representative',
        title: 'Parlamentar',
        templateUrl: helper.basepath('representative.html'),
        resolve: helper.resolveFor('chartjs', 'ngTable'),
        controller: 'RepresentativeDataController'
    })
    .state('app.committee', {
        url: '/committees/:house/:committeeID',
        title: 'Comissão',
        templateUrl: helper.basepath('committee.html'),
        controller: 'CommitteesController'
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
    .state('page.404', {
        url: '/404',
        title: "Não encontrada",
        templateUrl: 'app/pages/404.html'
    })
    .state('login', {
        url: '/login',
        title: 'Login',
        templateUrl: 'app/pages/login.html'
    })
    ;


}]).config(['$ocLazyLoadProvider', 'APP_REQUIRES', function ($ocLazyLoadProvider, APP_REQUIRES) {
    'use strict';

    // Lazy Load modules configuration
    $ocLazyLoadProvider.config({
      debug: false,
      events: true,
      modules: APP_REQUIRES.modules
    });

}]).config(['$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
    function ( $controllerProvider, $compileProvider, $filterProvider, $provide) {
      'use strict';
      // registering components after bootstrap
      App.controller = $controllerProvider.register;
      App.directive  = $compileProvider.directive;
      App.filter     = $filterProvider.register;
      App.factory    = $provide.factory;
      App.service    = $provide.service;
      App.constant   = $provide.constant;
      App.value      = $provide.value;

}]).config(['$translateProvider', function ($translateProvider) {
    $translateProvider.useStaticFilesLoader({
        prefix : 'app/i18n/',
        suffix : '.json'
    });
    $translateProvider.preferredLanguage('pt_BR');
    $translateProvider.useLocalStorage();
    $translateProvider.usePostCompiling(true);

}]).config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeBar = true;
    cfpLoadingBarProvider.includeSpinner = false;
    cfpLoadingBarProvider.latencyThreshold = 500;
    cfpLoadingBarProvider.parentSelector = '.wrapper > section';
}]).config(['$tooltipProvider', function ($tooltipProvider) {

    $tooltipProvider.options({appendToBody: true});

}]);
