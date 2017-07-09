describe('UserDashboardCtrl', function() {
  let service, q, rootScope, controller;
  beforeEach(module('DroneCafeApp'));
  beforeEach(inject(function($controller, UserDashboardService, $q, $rootScope) {
    rootScope = $rootScope;
    q = $q;
    service = UserDashboardService;
    controller = $controller;
  }));

  it('Should add 100 galactic credits when add credits button clicked', function() {
    const scope = rootScope.$new();
    const stub = sinon.stub(service, 'updateUserBalance').returns(q.when({}));
    const ctrl = controller('UserDashboardCtrl as user', {'UserDashboardService': service, $scope: scope});
    scope.user.user = {balance: 0};

    scope.user.addCredits();
    scope.$digest();

    expect(scope.user.user.balance).toBe(100);
  });

  it('Should display all dishes', function() {
    const scope = rootScope.$new();
    const stub = sinon.stub(service, 'getDishes').returns(q.when({data: [{},{}]}));
    const ctrl = controller('UserDashboardCtrl as user', {'UserDashboardService': service, $scope: scope});

    scope.user.showDishes();
    scope.$digest();

    expect(scope.user.dishes.length).toBe(2);
  });
});