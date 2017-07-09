module.exports = function(mongoose) {
  const DishSchema = new mongoose.Schema({
    title: String,
    imageUrl: String,
    rating: Number,
    ingredients: [String],
    price: Number
  });

  const Dish = mongoose.connection.model('Dish', DishSchema, 'dish');

  return Dish;
}