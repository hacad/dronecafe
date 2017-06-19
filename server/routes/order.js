const express = require('express');
const bodyParser = require('body-parser');
const drone = require('netology-fake-drone-api');
const router = express.Router();

module.exports = function(mongoose) {
  const Order = require('../models/order')(mongoose);

  router.route('/')
    .get(function(req, res) {
      const matchQuery = {
        $match: {}
      }

      if (req.query.userId) {
        matchQuery.$match['userId'] = mongoose.Types.ObjectId(req.query.userId);
      }

      if (req.query.status) {
        matchQuery.$match['status'] = req.query.status;
      }

      Order.aggregate({
        $lookup: {
          'from': 'dish',
          'localField': 'dishId',
          'foreignField': '_id',
          'as': 'dish'
        }
      },
      {
        $unwind: '$dish'
      },
      {
        $project: {
          '_id': 1,
          'userId': 1,
          'dishId': 1,
          'status': 1,
          'dishName': '$dish.title'
        }
      }, matchQuery)
      .exec(function(err, orders) {
        if(err) {
          console.log(err);
          res.status(500);
          res.send('Error in getting orders');
        } else {
          res.json(orders);
        }
      });
    })
    .post(function(req, res) {
      const newOrder = new Order();
      newOrder.userId = mongoose.Types.ObjectId(req.body.userId);
      newOrder.dishId = mongoose.Types.ObjectId(req.body.dishId);
      newOrder.status = 'ordered';

      newOrder.save(function(err) {
        if(err) {
          console.log(err);
          res.status(500);
          res.send('Error in saving order');
        } else {
          res.json({'message': 'Order created'});
        }
      });
    });
  
  router.route('/:orderId')
    .put(function(req, res) {
      Order.findById(req.params.orderId, function(err, order) {
        if(err) {
          console.log(err);
          res.status(500);
          res.send('Error in finding order');
        } else {
          order.status = req.body.status;
          order.save(function(err) {
            if(err) {
              console.log(err);
              res.status(500);
              res.send('Error in saving order');
            } else {
              res.json({'message': 'order updated'});
              if (order.status == 'ordered') {
                //socket logic
              }

              if(order.status == 'todeliver') {
                drone
                  .deliver()
                  .then(function(){
                    console.log('delivered');
                    order.status = 'delivered';
                    order.save(function(err) {
                      if(err) {
                        console.log(err);
                      } else {
                        //socket logic
                      }
                    })
                  })
                  .catch(function(err) {
                    console.log(`Error in delivering\n${err}`);
                    order.status = 'faileddeliver';
                    order.save(function(err) {
                      if(err) {
                        console.log(err);
                      } else {
                        //socket logic
                      }
                    })
                  });
              }
            }
          });
        }
      });
    })
    .delete(function(req, res) {
      Order.remove({
        _id: req.params.orderId
      }, function(err) {
        if(err) {
          console.log(`Error in deleting\n${err}`);
          res.status(500);
          res.send('Error in deleting');
        } else {
          res.json({'message': 'order deleted'});
        }
      });
    });

  return router;
}