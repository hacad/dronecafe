angular
  .module('DroneCafeApp')
  .controller('KitchenDashboardCtrl', function ($scope, KitchenDashboardService) {
    $scope.orderedDishes = [];
    $scope.cookingDishes = [];
    const socket = io();

    KitchenDashboardService.getDishesByStatus('ordered').then(function (data) {
      $scope.orderedDishes = data.data;
    });

    KitchenDashboardService.getDishesByStatus('cooking').then(function (data) {
      $scope.cookingDishes = data.data;
    });

    $scope.startCooking = function (order, orderIndex) {
      KitchenDashboardService.setOrderStatus(order._id, 'cooking').then(function() {
        order.status = 'cooking';
        $scope.orderedDishes.splice(orderIndex, 1);
        $scope.cookingDishes.push(order);
      });
    }

    $scope.finishCooking = function (order, orderIndex) {
      KitchenDashboardService.setOrderStatus(order._id, 'todeliver').then(function() {
        order.status = 'todeliver';
        $scope.cookingDishes.splice(orderIndex, 1);
      });
    }

    socket.on('server.order.created', function (newOrder) {
      $scope.orderedDishes.push(newOrder);
    });
  });