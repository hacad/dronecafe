class UserPageObject {
  get () {
    browser.get('http://localhost:1337/#!/');
  }

  login() {
    element(by.css('.btn-login')).click();
    element(by.css('#user_name')).sendKeys('testclient');
    element(by.css('#user_email')).sendKeys('testclient@test.com');
    element(by.css('input[type="submit"')).click();
  }

  btnShowDishesClick() {
    element(by.css('.btn-show-dishes')).click();
  }

  btnOrderDishClick() {
    element(by.css('.btn-order-dish:first-child')).click();
  }

  getUserOrderedDishesCount() {
    return element.all(by.repeater('dish in userOrderedDishes')).count();
  }

  getDishesToOrderCount() {
    return element.all(by.repeater('dish in dishes')).count();
  }
}

module.exports = UserPageObject;