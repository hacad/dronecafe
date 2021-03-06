module.exports = function(mongoose) {
  const OrderSchema = new mongoose.Schema({
    userId: mongoose.Schema.ObjectId,
    dishId: mongoose.Schema.ObjectId,
    dishName: String,
    status: String
  });

  const Order = mongoose.connection.model('Order', OrderSchema, 'order');

  return Order;
}