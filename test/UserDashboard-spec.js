const UserPageObject = require('./UserPageObject');

describe('User dashboard', function() {
  let userPageObject;
  
  beforeEach(function(){
    userPageObject = new UserPageObject();
    userPageObject.get();
    userPageObject.login();

    browser.wait(function() {
      return element(by.css(".btn-show-dishes")).isPresent();
    });
  });

  it('Should contains dishes to order', function() {
    userPageObject.btnShowDishesClick();
    expect(userPageObject.getDishesToOrderCount()).toEqual(3);
  });

  it('Shoould contains order when dish is ordered', function() {
    userPageObject.btnShowDishesClick();
    userPageObject.btnOrderDishClick();
    expect(userPageObject.getUserOrderedDishesCount()).toEqual(1);
  });
});