const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const io = require('socket.io');

const mongoose = require('mongoose');
//global.mongoose = mongoose;

const app = express();
const server = http.createServer(app);
const socketIO = io(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname + '/../public'));

const port = process.env.PORT || 1337;

const dbUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/dc';

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
    console.log(`Connected to database: ${dbUrl}`);
  }
});

const dbInit = require('./dbinitializer')(mongoose);
dbInit();

app.get('/', function(req, res) {
  //res.status(200).json({'message': 'drone cafe'});
  res.sendFile('index.html')
});
const clientRouter = require('./User/routes/client.js')(mongoose);
const orderRouter = require('./User/routes/order.js')(mongoose, socketIO);
const kitchenRouter = require('./Kitchen/routes/kitchen.js')(mongoose);
app.use('/api/clients', clientRouter);
app.use('/api/dishes', kitchenRouter);
app.use('/api/orders', orderRouter);

server.listen(port, function() {
  console.log(`server is started on port: ${port}`);
});

//todo: move to separate file
socketIO.on('connection', function(socket) {
  console.log('new user connected');

  socket.on('server.order.delivered', function(order) {
    socketIO.emit('server.order.delivered', order);
  });

  socket.on('server.order.delivered', function(order) {
    socketIO.emit('server.order.faileddeliver', order);
  });

  socket.on('disconnect', function(message) {
    console.log('user left');
  });
});