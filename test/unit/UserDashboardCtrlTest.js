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
    scope.user = {balance: 0};
    const stub = sinon.stub(service, 'updateUserBalance').returns(q.when({}));
    const ctrl = controller('UserDashboardCtrl', {'UserDashboardService': service, $scope: scope});

    scope.addCredits();
    scope.$digest();

    expect(scope.user.balance).toBe(100);
  });

  it('Should display all dishes', function() {
    const scope = rootScope.$new();
    const stub = sinon.stub(service, 'getDishes').returns(q.when({data: [{},{}]}));
    const ctrl = controller('UserDashboardCtrl', {'UserDashboardService': service, $scope: scope});

    scope.showDishes();
    scope.$digest();

    expect(scope.dishes.length).toBe(2);
  });
});