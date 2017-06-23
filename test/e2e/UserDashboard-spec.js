const UserPageObject = require('./UserPageObject');

describe('User dashboard', function() {
  let userPageObject;

  beforeEach(function(){
    userPageObject = new UserPageObject();
    userPageObject.get();
  });

  it('Should contains dishes to order', function() {
    userPageObject.login().then(function(){
      userPageObject.btnShowDishesClick();
      expect(userPageObject.getDishesToOrderCount()).toEqual(3);
    });
  });

  it('Should contains order when dish is ordered', function() {
    userPageObject.login().then(function() {
      userPageObject.btnShowDishesClick();
      userPageObject.getUserOrderedDishesCount().then(function(dishCountBeforeOrder) {
        let expectedDishesAfterOrder = dishCountBeforeOrder + 1;  
        userPageObject.btnOrderDishClick();
        expect(userPageObject.getUserOrderedDishesCount()).toEqual(expectedDishesAfterOrder);
      });
    });
  });
});