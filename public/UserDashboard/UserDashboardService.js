/**
 *@module UserDashboardService
 */
(function(){
  angular
    .module('DroneCafeApp')
    .factory('UserDashboardService', userDashboardService);

    userDashboardService.$inject = ['$http'];

    /**
     * User dashboard service
     * @param $http - Angular $http service
     */
    function userDashboardService($http) {
      const clientsApiUrl = '/api/clients/';
      const ordersApiUrl = '/api/orders/';

      var service = {
        getUserInfo,
        createNewUser,
        updateUserBalance,
        getUserOrders,
        getDishes,
        createNewOrder,
        updateOrderStatus,
        deleteOrder
      }

      return service;
      
      /**
       * Returns full info about user
       * @async
       * @param user - information about user to find
       * @param {string} user.name - user name
       * @param {string} user.email - user email
       */
      function getUserInfo(user) {
        const config = {
          params: {
            name: user.name,
            email: user.email
          }
        };

        return $http.get(clientsApiUrl, config);
      }

      /**
       * Creates user
       * @async
       * @param userInfo - information about user to create
       * @param {string} user.name - user name
       * @param {string} user.email - user email
       */
      function createNewUser(userInfo) {
          //todo: try create rejected promise in case of invalid userInfo 
          //var deferred = $q.defer();
          return $http({
            method: 'POST',
            url: clientsApiUrl,
            data: userInfo
          });
      }

      /**
       * Updates user balance
       * @async
       * @param {string} userId - user id
       * @param {number} newBalance - balance to set
       */
      function updateUserBalance(userId, newBalance) {
        return $http({
          method: 'PUT',
          url: clientsApiUrl + userId,
          data: {
            balance: newBalance
          }
        });
      }

      /**
       * Returns user orders
       * @async
       * @param {string} userId - user id
       */
      function getUserOrders(userId) {
        return $http.get(ordersApiUrl, {params: {userId: userId}});
      }

      /**
       * Returns availabe dishes
       * @async
       * @returns {{title: String, imageUrl: String, rating: Number, ingredients: String[], price: Number}}
       */
      function getDishes() {
        return $http.get('/api/dishes');
      }

      /**
       * Creates order for the user
       * @async
       * @param {string} userId - user id
       * @param {string} dishId - dish id
       * @param {string} dishName - dish name
       * @returns {{userId: String, dishId: String, dishName: String, status: String}}
       */
      function createNewOrder(userId, dishId, dishName) {
        return $http({
          method: 'POST',
          url: ordersApiUrl,
          data: {
            userId,
            dishId,
            dishName
          }
        });
      }

      /**
       * Updates order status
       * @async
       * @param {String} orderId - order id
       * @param {String} newStatus - status
       */
      function updateOrderStatus(orderId, newStatus) {
        return $http({
          method: 'PUT',
          url: ordersApiUrl + orderId,
          data: {
            status: newStatus
          }
        });
      }

      /**
       * Deletes order
       * @async
       * @param {String} orderId - id of order to delete
       */
      function deleteOrder(orderId) {
        return $http({
          method: 'DELETE',
          url: ordersApiUrl + orderId,
          data: {
            status: newStatus
          }
        });
      }      
    }
  })();