/**
 * @module KitchenDashboardCtrl
 */
(function(){
  angular
    .module('DroneCafeApp')
    .controller('KitchenDashboardCtrl', kitchenDashboardCtrl);

    kitchenDashboardCtrl.$inject = ['$scope', 'KitchenDashboardService'];

    /**
     * Kitchen dashboard controller
     * @param $scope - Anular $scope service
     * @param {KitchenDashboardService} KitchenDashboardService
     */
    function kitchenDashboardCtrl($scope, KitchenDashboardService) {
      var vm = this;

      vm.orderedDishes = [];
      vm.cookingDishes = [];
      const socket = io();

      vm.startCooking = startCooking;
      vm.finishCooking = finishCooking;
      
      KitchenDashboardService.getDishesByStatus('ordered').then(function (data) {
        vm.orderedDishes = data.data;
      });

      KitchenDashboardService.getDishesByStatus('cooking').then(function (data) {
        vm.cookingDishes = data.data;
      });

      /**
       * Starts cooking order
       * @param order - order to start cook 
       * @param order._id - id of order
       * @param {Number} orderIndex - index of order in the orderedDishes array
       */
      function startCooking(order, orderIndex) {
        KitchenDashboardService.setOrderStatus(order._id, 'cooking').then(function() {
          order.status = 'cooking';
          vm.orderedDishes.splice(orderIndex, 1);
          vm.cookingDishes.push(order);
        });
      }

      /**
       * Finishes cooking order
       * @param order - order to start cook 
       * @param order._id - id of order
       * @param {Number} orderIndex - index of order in the orderedDishes array
       */
      function finishCooking(order, orderIndex) {
        KitchenDashboardService.setOrderStatus(order._id, 'todeliver').then(function() {
          order.status = 'todeliver';
          vm.cookingDishes.splice(orderIndex, 1);
        });
      }

      socket.on('server.order.created', function (newOrder) {
        // KitchenDashboardService.getDishesByStatus('ordered').then(function (data) {
        //   vm.orderedDishes = data.data;
        // });
        vm.orderedDishes.push(newOrder);
        $scope.$apply();
      });
    }
  })();