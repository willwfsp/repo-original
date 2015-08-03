// To run this code, edit file
// index.html or index.jade and change
// html data-ng-app attribute from
// angle to myAppName
// -----------------------------------

var myApp = angular.module('sigaLeiApp', ['angle']);

myApp.run(["$log", function($log) {

  $log.log('I\'m a line from custom.js');

}]);
