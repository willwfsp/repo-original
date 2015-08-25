/*!
 *
 * Angle - Bootstrap Admin App + AngularJS
 *
 * Author: @themicon_co
 * Website: http://themicon.co
 * License: http://support.wrapbootstrap.com/knowledge_base/topics/usage-licenses
 *
 */

if (typeof $ === 'undefined') { throw new Error('This application\'s JavaScript requires jQuery'); }

// APP START
// -----------------------------------

var App = angular.module('sigaLeiApp', [
    'ngRoute',
    'ngAnimate',
    'ngStorage',
    'ngCookies',
    'pascalprecht.translate',
    'ui.bootstrap',
    'ui.router',
    'oc.lazyLoad',
    'cfp.loadingBar',
    'ngSanitize',
    'ngResource',
    'ui.utils',
    'http-auth-interceptor',
    'angulartics',
    'angulartics.google.analytics'
  ]);

App.run(
  ['$rootScope', '$state', '$stateParams',  '$window', '$templateCache',
   'Auth', '$timeout', 'cfpLoadingBar', '$log',
    function ($rootScope, $state, $stateParams, $window, $templateCache, Auth, $timeout, cfpLoadingBar, $log) {
    ga('create', 'UA-65800611-2', 'none');
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

        /* Auth */
        if(!('data' in toState) || !('access' in toState.data)){
            $log.error("Access undefined for this state");
            event.preventDefault();
        }
        else if (!Auth.authorize(toState.data.access)) {
            $log.error("Seems like you tried accessing a route you don't have access to...");
            event.preventDefault();

            if(fromState.url === '^') {
                if(Auth.isLoggedIn()) {
                    $state.go('app.dashBoard');
                } else {
                    $rootScope.error = null;
                    $state.go('page.login');
                }
            }
        }
        if($('.wrapper > section').length) // check if bar container exists
          thBar = $timeout(function() {
            cfpLoadingBar.start();
          }, 0); // sets a latency Threshold
    });
    // Set reference to access them from any scope
    //$window.localStorage.clear();
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.$storage = $window.localStorage;

    /* Uncomment this to disable template cache
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        if (typeof(toState) !== 'undefined'){
          $templateCache.remove(toState.templateUrl);
        }
    });*/
    // Scope Globals
    // -----------------------------------
    $rootScope.app = {
      name: 'SigaLei',
      description: 'Busque e acompanhe os projetos de lei em discussão no Congresso Nacional e nas Assembleias Legislativas',
      year: ((new Date()).getFullYear()),
      keywords: 'projetos de lei, legislativo, congresso nacional, camara dos deputados, senado',
      layout: {
        isFixed: true,
        isCollapsed: false,
        isBoxed: false,
        isRTL: false,
        horizontal: true,
        isFloat: false,
        asideHover: false,
        theme: "app/css/theme-sigalei.css"
      },
      useFullLayout: false,
      hiddenFooter: false,
      viewAnimation: 'ng-fadeInUp'
    };
    $rootScope.user = {};
}]);
