var droneCafeApp = angular.module('DroneCafeApp', ['ngRoute', 'ngResource']);

angular
  .module('DroneCafeApp')
  .config(['$routeProvider', '$locationProvider',  function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
      .when('/', {
        templateUrl: 'UserDashboard/UserDashboard.html',
        controller: 'UserDashboardCtrl'
      })
      .when('/kitchen', {
        templateUrl: 'KitchenDashboard/KitchenDashboard.html',
        controller: 'KitchenDashboardCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);