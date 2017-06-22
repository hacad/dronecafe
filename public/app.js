var droneCafeApp = angular.module('DroneCafeApp', ['ngRoute', 'ngResource']);

angular
  .module('DroneCafeApp')
  .config(['$routeProvider', function($routeProvider) {
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