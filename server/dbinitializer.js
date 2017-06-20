module.exports = function(mongoose) {
  const Dish = require('./models/dish')(mongoose);
  const dishes = require('./menu');
  
  return function fillDishes() {
    Dish
      .find({})
      .exec()
      .then(function(foundDishes){
        if(!foundDishes.length) {
          dishes.forEach(function(currentDish){
            const newDish = new Dish({
              'title': currentDish.title,
              'imageUrl': currentDish.imageUrl,
              'rating': currentDish.rating,
              'ingredients': currentDish.ingredients,
              'price': currentDish.price
            });
  
            newDish.save(function(err){
              if(err) {
                console.log(`Error in saving new dush to db\n${err}`)
              }
            });
          });
        }
      });
  }
}