const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');

const mongoose = require('mongoose');
//global.mongoose = mongoose;

const app = express();
const server = http.createServer(app);

app.use(bodyParser.json());

app.use(express.static(__dirname + '/../public'));

const port = process.env.PORT || 1337;

const dbUrl = 'mongodb://localhost:27017/dc';
const dbConnectionOptions = {
  server: {
    socketOptions: {
      keepAlive: 300000,
      connectTimeoutMS: 300000
    }
  }
}

mongoose.Promise = global.Promise;

mongoose.connect(dbUrl, dbConnectionOptions, function(err, db) {
  if(err) {
    console.log(`Cannot connect to database\n ${err}`);
  } else {
    console.log('Connected to database');
  }
});

const dbInit = require('./dbinitializer')(mongoose);
dbInit();

app.get('/', function(req, res) {
  //res.status(200).json({'message': 'drone cafe'});
  res.sendFile('index.html')
});

const clientRouter = require('./routes/client.js')(mongoose);
const dishRouter = require('./routes/dish.js')(mongoose);
const orderRouter = require('./routes/order.js')(mongoose);
app.use('/api/clients', clientRouter);
app.use('/api/dishes', dishRouter);
app.use('/api/orders', orderRouter);

server.listen(port, function() {
  console.log(`server is started on port: ${port}`);
})