angular
  .module('DroneCafeApp')
  .factory('KitchenService', function ($http) {
    const apiUrl = '/api/orders/';
    return {
      getDishesByStatus: function (dishStatus) {
        return $http.get(apiUrl, {
          params: {
            status: dishStatus
          }
        })
      },

      setOrderStatus: function (orderId, status) {
        return $http({
          method: 'PUT',
          url: apiUrl + orderId,
          data: {status}
        });
      }
    }
  });