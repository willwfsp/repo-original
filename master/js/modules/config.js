/**=========================================================
 * Module: config.js
 * App routes and resources configuration
 =========================================================*/


App.config(
  ['$stateProvider', '$locationProvider', '$urlRouterProvider',
   'RouteHelpersProvider','$httpProvider',
    function($stateProvider, $locationProvider, $urlRouterProvider,
             helper, $httpProvider) {

    'use strict';
    var access = routingConfig.accessLevels;
    // Set the following to true to enable the HTML5 Mode
    // You may have to set <base> tag in index and a routing configuration in your server
    $locationProvider.html5Mode(false);

    // default route

    $urlRouterProvider.otherwise( function($injector, $location) {
            var $state = $injector.get("$state");
            $state.go("app.dashBoard");
        });

  //
  // Application Routes
  // -----------------------------------
  $stateProvider
    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: helper.basepath('app.html'),
        controller: 'AppController',
        resolve: helper.resolveFor('modernizr', 'icons', 'loaders.css', 'spinkit','ngDialog'),
        data: {
                access: access.user
            }
    })
    .state('app.dashBoard', {
        url: '/dashboard',
        title: 'Página Principal',
        templateUrl: helper.basepath('dashboard.html'),
        controller: 'DashboardController'
    })
    .state('app.searchBills', {
        url: '/searchBills?q',
        title: 'Pesquisar Proposições',
        templateUrl: helper.basepath('searchBills.html'),
        resolve: helper.resolveFor('ui.select', 'ngSticky'),
        controller: 'SearchBillsController'
    })
    .state('app.bill', {
        url: '/bill/:billName',
        title: 'Visualizar Projeto de Lei',
        templateUrl: helper.basepath('bill.html'),
        resolve: helper.resolveFor('ngTable'),
        controller: 'BillController'
    })
    .state('app.viewDocuments', {
        url: '/viewDocuments/:docUrl',
        title: 'Visualizar Documento',
        templateUrl: helper.basepath('viewDocuments.html'),
        controller: 'ViewDocumentsController'
    })
    .state('app.bill.pollDetails', {
        url: '/pollDetails/:pollID',
        title: 'Visualizar detalhes da votação',
        onEnter: ['$stateParams', '$state', '$modal', function($stateParams, $state, $modal) {
          $modal.open({
            templateUrl: helper.basepath('pollDetails.html'),
            resolve: helper.resolveFor('ngTable'),
            controller: 'PollDetailsController'
          }).result.finally(function() {
              $state.go('^');
          });
        }]
    })
    .state('app.representative', {
        url: '/representative/:id',
        title: 'Parlamentar',
        templateUrl: helper.basepath('representative.html'),
        resolve: helper.resolveFor('chartjs', 'ngTable'),
        controller: 'RepresentativeDataController'
    })
    .state('app.committee', {
        url: '/committees/:house/:committeeID',
        title: 'Comissão',
        templateUrl: helper.basepath('committee.html'),
        resolve: helper.resolveFor('ngTable'),
        controller: 'CommitteesController'
    })
    .state('app.calendar', {
        url: '/calendar',
        title: 'Calendários',
        templateUrl: helper.basepath('calendar.html')
    })
    .state('app.house', {
        url: '/house/:house',
        title: 'Casa Legislativa',
        templateUrl: helper.basepath('house.html'),
        resolve: helper.resolveFor('ngTable'),
        controller: 'HouseDataController'
    })
    .state('app.profile', {
        url: '/profile',
        title: 'Perfil do Usuário',
        templateUrl: helper.basepath('profile.html'),
        controller: 'ProfileController'
    })
    .state('app.reports', {
        url: '/reports',
        title: 'Relatórios',
        templateUrl: helper.basepath('reports.html')
    })
    .state('page', {
        url: '/page',
        abstract: true,
        templateUrl: 'app/pages/page.html',
        resolve: helper.resolveFor('modernizr', 'icons', 'loaders.css', 'spinkit'),
        controller: ["$rootScope", function($rootScope) {
            $rootScope.app.layout.isBoxed = false;
        }],
        data: {
                access: access.anon
            }
    })
    .state('page.404', {
        url: '/404',
        title: "Não encontrada",
        templateUrl: 'app/pages/404.html'
    })
    .state('page.login', {
        url: '/login',
        title: 'Login',
        templateUrl: 'app/pages/login.html'
    })
    .state('page.signup', {
        url: '/signup',
        title: 'Registrar',
        controller: 'SignupController',
        templateUrl: 'app/pages/signup.html',
        resolve: angular.extend(helper.resolveFor('ngDialog'))
    })
    .state('page.signup-confirmation', {
        url: '/signup/:token',
        title: 'Registrar',
        controller: 'SignupConfirmController',
        templateUrl: 'app/pages/signup-confirmation.html',
        resolve: angular.extend(helper.resolveFor('ngDialog'))
    })
    .state('page.recover', {
        url: '/recover',
        title: "Recover",
        controller: 'RecoverPasswordController',
        templateUrl: 'app/pages/recover.html'
    })
    .state('page.recover-confirmation', {
        url: '/recover/:token',
        title: "Recover",
        controller: 'RecoverPasswordConfirmController',
        templateUrl: 'app/pages/recover-confirmation.html'
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
    cfpLoadingBarProvider.includeBar = false;
    cfpLoadingBarProvider.includeSpinner = false;
    cfpLoadingBarProvider.latencyThreshold = 500;
    cfpLoadingBarProvider.parentSelector = '.wrapper > section';
}]).config(['$tooltipProvider', function ($tooltipProvider) {

    $tooltipProvider.options({appendToBody: true});

}]);
