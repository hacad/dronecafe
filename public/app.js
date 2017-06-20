var droneCafeApp = angular.module('DroneCafeApp', ['ng-route', 'ng-resource']);

angular
  .module('DroneCafeApp')
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'UserDashboard/userdashboard.html',
        controller: 'UserDashboardCtrl'
      })
      .when('/kitchen', {
        templateUrl: 'CookDashboard/cookdashboard.html',
        controller: 'CookDashboardCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);