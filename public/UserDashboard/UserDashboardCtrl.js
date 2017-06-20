angular
  .module('DroneCafeApp')
  .controller('UserDashboardCtrl', function($scope, UserDashboardService) {
    $scope.isUserLogged = false;
    $scope.dishesDisplayed = false;
    $scope.dishes = [];
    let socket = io();

    $scope.showLoginWindow = function() {
      $('#loginPopup').modal();
      $('#loginPopup').modal('open');
      $scope.user = {};
    }

    $scope.login = function (user) {
      $('#loginPopup').modal('close');
      $scope.isUserLogged = true;
      $scope.user = user;

      UserDashboardService.getuserInfo($scope.user).then(function(data) {
        let userData = data.data;

        if (!userData || !userData.length) {
          $scope.user.balance = 100;
          UserDashboardService.createNewUser($scope.user).then(function(data) {
            $scope.user = data.data;
          });
        } else {
          $scope.user = userData[0];

          UserDashboardService.getUserOrders($scope.user._id).then(function(data) {
            if (data.data) {
              $scope.userOrderedDishes = data.data;
            }
          });
        }
      });
    }

    $scope.addCredits = function() {
      UserDashboardService.updateUserBalance($scope.user.id, $scope.user.balance + 100).then(function(data) {
        $scope.user.balance += 100;
      });
    }

    $scope.showDishes = function() {
      $scope.dishesDisplayed = true;

      UserDashboardService.getDishes().then(function(data){
        $scope.dishes = data.data;
      });
    }

    $scope.orderDish = function(dishId, dishPrice) {
      const newBalance = $scope.user.balance - dishPrice;
      UserDashboardService.updateUserBalance($scope.user._id, newBalance).then(function(data) {
        $scope.user.balance = balance;

        UserDashboardService.createNewOrder($scope.user._id, dishId).then(function(data){
          
        });
      });
    }

    $scope.makeIngredientsList = function(ingredients) {
      return ingredients.join(', ');
    };

    socket.on('server.order.created', function(newOrder) {
      $scope.userOrderedDishes.push(newOrder);
    });

    socket.on('server.order.statuschanged', function(order) {
      let orderToUpdate = $scope.userOrderedDishes.find(function (item) {
        return item._id == order._id;
      });

      orderToUpdate.status = order.status;
      $scope.$apply();
    });
  });