class UserPageObject {
  get () {
    browser.get('http://localhost:1337/#!/');
  }

  login() {
    element(by.css('.page .btn-login')).click();
    element(by.css('.page #user_name')).sendKeys('testclient');
    element(by.css('.page #user_email')).sendKeys('testclient@test.com');
    return element(by.css('.page button[type="submit"')).click();
  }

  btnShowDishesClick() {
    let btn = element(by.css('.page .btn-show-dishes'));
    if (btn.isDisplayed()) {
      btn.click();
    }
  }

  btnOrderDishClick() {
    element(by.css('.page .btn-order-dish:first-child')).click();
  }

  getUserOrderedDishesCount() {
    return element.all(by.repeater('dish in user.userOrderedDishes')).count();
  }

  getDishesToOrderCount() {
    return element.all(by.repeater('dish in user.dishes')).count();
  }
}

module.exports = UserPageObject;