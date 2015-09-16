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
    'angulartics.google.analytics',
    'ui.calendar'
  ]);

App.run(
  ['$rootScope', '$state', '$stateParams',  '$window', '$templateCache',
   'Auth', '$timeout', 'cfpLoadingBar', '$log', 'spinnerService',
    function ($rootScope, $state, $stateParams, $window, $templateCache, Auth, $timeout, cfpLoadingBar, $log, spinnerService) {

    // Check authentication before loading a page
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        // Invalid State or access not defined in app
        if(!('data' in toState) || !('access' in toState.data)){
            $log.error("Access undefined for this state");
            event.preventDefault();
        }
        //if authorized
        else if (!Auth.authorize(toState.data.access)) {
            $log.error("Seems like you tried accessing a route you don't have access to...");
            Auth.logout();
            $rootScope.accessedRoute = toState;
            $rootScope.accessedRouteParams = toParams;
            event.preventDefault();

            //if direct access
            if(fromState.url === '^') {
                if(Auth.isLoggedIn()) {
                    $state.go('app.dashBoard');
                } else {
                    $rootScope.error = null;
                    Auth.logout();
                    $state.go('page.login');
                }
            }
        }


        // display new view from top
        if(toState.name != 'app.bill.pollDetails'){
            $window.scrollTo(0, 0);
        }
    });
    // Set reference to access them from any scope
    //$window.localStorage.clear();
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.$storage = $window.localStorage;
    $rootScope.apiURL = "https://sigalei-dev-api.mybluemix.net/v1/";

    $rootScope.notificationSettings = {
        message: '',
        positionY: 'bottom',
        positionX: 'center',
        delay:1000
    }

    //amMoment.changeLocale('pt-br');
    //Uncomment this to disable template cache
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        if (typeof(toState) !== 'undefined'){
          $templateCache.remove(toState.templateUrl);
        }
    });
    // Scope Globals
    // -----------------------------------
    $rootScope.app = {
      name: 'SigaLei',
      description: 'Busque, acompanhe e analise os projetos de lei em discussão no Congresso Nacional e nas Assembleias Legislativas',
      year: ((new Date()).getFullYear()),
      keywords: 'projetos de lei, legislativo, congresso nacional, camara dos deputados, senado',
      layout: {
        isFixed: true,
        isCollapsed: true,
        isBoxed: false,
        isRTL: false,
        horizontal: false,
        isFloat: false,
        asideHover: false,
        theme: "app/css/theme-sigalei.css"
      },
        useFullLayout: false,
        hiddenFooter: false,
        offsidebarOpen: false,
        asideToggled: false,
      viewAnimation: 'ng-fadeInUp'
    };
    $rootScope.user = {};
}]);
