angular
  .module('DroneCafeApp')
  .factory('UserDashboardService', function($http) {
    const clientsApiUrl = '/api/clients/';
    const ordersApiUrl = '/api/orders/';

    return {
      getUserInfo: function(user) {
        const config = {
          params: {
            name: user.name,
            email: user.email
          }
        };

        return $http.get(clientsApiUrl, config);
      },

      createNewUser: function(userInfo) {
        //todo: try create rejected promise in case of invalid userInfo 
        //var deferred = $q.defer();
        return $http({
          method: 'POST',
          url: clientsApiUrl,
          data: userInfo
        });
      },

      updateUserBalance: function(userId, newBalance) {
        return $http({
          method: 'PUT',
          url: clientsApiUrl + userId,
          data: {
            balance: newBalance
          }
        });
      },

      getUserOrders: function (userId) {
        return $http.get(ordersApiUrl, {params: {userId: userId}});
      },

      getDishes: function() {
        return $http.get('/api/dishes');
      },

      createNewOrder: function (userId, dishId, dishName) {
        return $http({
          method: 'POST',
          url: ordersApiUrl,
          data: {
            userId,
            dishId,
            dishName
          }
        });
      },

      updateOrderStatus: function(orderId, newStatus) {
        return $http({
          method: 'PUT',
          url: ordersApiUrl + orderId,
          data: {
            status: newStatus
          }
        });
      },

      deleteOrder: function (orderId) {
        return $http({
          method: 'DELETE',
          url: ordersApiUrl + orderId,
          data: {
            status: newStatus
          }
        });
      }
    }
  });