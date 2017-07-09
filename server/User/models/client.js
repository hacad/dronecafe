module.exports = function(mongoose) {
  const ClientSchema = new mongoose.Schema({
    name: String,
    email: String,
    balance: Number
  });

  const Client = mongoose.connection.model('Client', ClientSchema, 'client');

  return Client;
}