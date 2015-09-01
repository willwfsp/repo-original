/**=========================================================
 * Module: main.js
 * Main Application Controller
 =========================================================*/

App.controller('AppController',
  ['$rootScope', '$scope', '$state', '$translate', '$window', '$localStorage', '$timeout', 'toggleStateService', 'colors', 'browser', 'cfpLoadingBar', 'Auth', 'spinnerService',
  function($rootScope, $scope, $state, $translate, $window, $localStorage, $timeout, toggle, colors, browser, cfpLoadingBar, Auth, spinnerService) {
    "use strict";

    // Setup the layout mode
    // $rootScope.app.layout.horizontal = true ;

    // Loading bar transition
    // -----------------------------------
    var thBar;

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {


        if($('.wrapper > section').length) // check if bar container exists
          thBar = $timeout(function() {
            cfpLoadingBar.start();
        }, 0); // sets a latency Threshold
        // Save the route title
        event.targetScope.$watch("$viewContentLoaded", function () {
            $timeout.cancel(thBar);
            cfpLoadingBar.complete();
            $rootScope.currTitle = $state.current.title;
            $rootScope.pageTitle();
        });
    });

    $rootScope.$on('event:dismiss-loading', function(event, toState, toParams, fromState, fromParams) {
        spinnerService.hide("ScreenLoading");
    });

    $rootScope.$on('event:show-loading', function(event, toState, toParams, fromState, fromParams) {
        spinnerService.show("ScreenLoading");
    });




    /* Hook not found
    $rootScope.$on('$stateNotFound',
      function(event) {
        $state.go('page.404');
    });*/
    /* Hook not found - Exemplo...
    $rootScope.$on('$stateNotFound',
      function(event, unfoundState, fromState, fromParams) {
          console.log(unfoundState.to); // "lazy.state"
          console.log(unfoundState.toParams); // {a:1, b:2}
          console.log(unfoundState.options); // {inherit:false} + default options
      });*/
    // Hook error
    $rootScope.$on('$stateChangeError',
      function(event, toState, toParams, fromState, fromParams, error){
        console.log(error);
      });

    $rootScope.currTitle = $state.current.title;

    $rootScope.pageTitle = function() {
      var title = $rootScope.app.name + ' - ' + ($rootScope.currTitle || $rootScope.app.description);
      document.title = title;
      return title;
    };

    // iPad may presents ghost click issues
    // if( ! browser.ipad )
      // FastClick.attach(document.body);

    // Close submenu when sidebar change from collapsed to normal
    $rootScope.$watch('app.layout.isCollapsed', function(newValue, oldValue) {
      if( newValue === false )
        $rootScope.$broadcast('closeSidebarMenu');
    });

    // Restore layout settings
    if( angular.isDefined($localStorage.layout) )
      $scope.app.layout = $localStorage.layout;
    else
      $localStorage.layout = $scope.app.layout;

    $rootScope.$watch("app.layout", function () {
      $localStorage.layout = $scope.app.layout;
    }, true);


    // Allows to use branding color with interpolation
    // {{ colorByName('primary') }}
    $scope.colorByName = colors.byName;

    // Internationalization
    // ----------------------

    $scope.language = {
      // Handles language dropdown
      listIsOpen: false,
      // list of available languages
      available: {
        'pt_BR':    'Português',
      },
      // display always the current ui language
      init: function () {
        var proposedLanguage = $translate.proposedLanguage() || $translate.use();
        var preferredLanguage = $translate.preferredLanguage(); // we know we have set a preferred one in app.config
        $scope.language.selected = $scope.language.available[ (proposedLanguage || preferredLanguage) ];
      },
      set: function (localeId, ev) {
        // Set the new idiom
        $translate.use(localeId);
        // save a reference for the current language
        $scope.language.selected = $scope.language.available[localeId];
        // finally toggle dropdown
        $scope.language.listIsOpen = ! $scope.language.listIsOpen;
      }
    };

    $scope.language.init();

    // Restore application classes state
    toggle.restoreState( $(document.body) );

    // cancel click event easily
    $rootScope.cancel = function($event) {
      $event.stopPropagation();
    };

    $scope.logout = function(){
      spinnerService._unregisterAll();
      Auth.logout();
      $state.go("page.login");
    };
    $scope.profile = function(){
      $state.go("app.profile");
    };

    $rootScope.$on("event:auth-loginRequired", function() {
       $scope.logout();
    });

}]);
