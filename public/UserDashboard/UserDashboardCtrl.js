/**
 * @module UserDashboardCtrl
 */
(function(){
  angular
    .module('DroneCafeApp')
    .controller('UserDashboardCtrl', userDashboardCtrl);

    userDashboardCtrl.$inject = ['$scope', 'UserDashboardService'];

    /**
     * User dashboard controller
     * @param $scope - Angular $scope service
     * @param UserDashboardService - UserDashboardService 
     */
    function userDashboardCtrl($scope, UserDashboardService) {
      var vm = this;

      vm.isUserLogged = false;
      vm.isDishesDisplayed = false;
      vm.dishes = [];
      vm.userOrderedDishes = [];
      let socket = io();

      vm.showLoginWindow = showLoginWindow;
      vm.login = login;
      vm.addCredits = addCredits;
      vm.showDishes = showDishes;
      vm.orderDish = orderDish;
      vm.makeIngredientsList = makeIngredientsList;

      /**
       * Shows login popup window
       */
      function showLoginWindow() {
        $('#loginPopup').modal();
        $('#loginPopup').modal('open');
        vm.user = {};
      }

      /**
       * Register and login user if not user doesn exist or login otherwise
       * @param user - user to login
       * @param user.name - name of user
       * @param user.email - email of user
       */
      function login(user) {
        $('#loginPopup').modal('close');
        vm.isUserLogged = true;
        vm.user = user;

        UserDashboardService.getUserInfo(vm.user).then(function(data) {
          let userData = data.data;

          if (!userData || !userData.length) {
            vm.user.balance = 100;
            UserDashboardService.createNewUser(vm.user).then(function(data) {
              vm.user = data.data;
            });
          } else {
            vm.user = userData[0];

            UserDashboardService.getUserOrders(vm.user._id).then(function(data) {
              if (data.data) {
                vm.userOrderedDishes = data.data;
              }
            });
          }
        });
      }

      /**
       * Add 100 galactic credits to current user
       */
      function addCredits() {
        UserDashboardService.updateUserBalance(vm.user._id, vm.user.balance + 100).then(function(data) {
          vm.user.balance += 100;
        });
      }

      /**
       * Show available dishes
       */
      function showDishes() {
        UserDashboardService.getDishes().then(function(data){
          vm.dishes = data.data;
          vm.isDishesDisplayed = true;
        });
      } 

      /**
       * 
       * @param dish - dish to order
       * @param dish._id - id of the dish
       * @param dish.title - title of the dish
       */
      function orderDish(dish) {
        const newBalance = vm.user.balance - dish.price;
        UserDashboardService.updateUserBalance(vm.user._id, newBalance).then(function(data) {
          vm.user.balance = newBalance;

          UserDashboardService.createNewOrder(vm.user._id, dish._id, dish.title).then(function(data){
            vm.userOrderedDishes.push(data.data.data);
          });
        });
      }

      /**
       * Returns string of ingredisnts from array of string
       * @param {String[]} ingredients - array of string 
       */
      function makeIngredientsList(ingredients) {
        return ingredients.join(', ');
      };

      // socket.on('server.order.created', function(newOrder) {
      //   vm.userOrderedDishes.push(newOrder);
      //   vm.$apply();
      // });

      socket.on('server.order.statuschanged', function(order) {
        let orderToUpdate = vm.userOrderedDishes.find(function (item) {
          return item._id == order._id;
        });

        if(orderToUpdate) {
          orderToUpdate.status = order.status;
          $scope.$apply();
        }
      });
    }
  })();