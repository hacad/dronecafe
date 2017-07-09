/**
 * @module KitchenDashboardService
 */
(function() {
  angular
    .module('DroneCafeApp')
    .factory('KitchenDashboardService', kitchenDashboardService);

    kitchenDashboardService.$inject = ['$http'];

    /**
     * Kitchen dashboard service
     * @param $http - Angular $http service
     */
    function kitchenDashboardService($http) {
      const apiUrl = '/api/orders/';

      var service = {
        getDishesByStatus,
        setOrderStatus
      }

      return service;

      /**
       * Returns dishes by status
       * @async
       * @param {String} dishStatus - status to filter
       * @returns {{title: String, imageUrl: String, rating: Number, ingredients: String[], price: Number}}
       */
      function getDishesByStatus(dishStatus) {
        return $http.get(apiUrl, {
          params: {
            status: dishStatus
          }
        })
      }

      /**
       * Set order status
       * @async
       * @param {string} orderId - id of order
       * @param {string} status - status to set
       */
      function setOrderStatus(orderId, status) {
        return $http({
          method: 'PUT',
          url: apiUrl + orderId,
          data: {status}
        });
      }
    }
  })();