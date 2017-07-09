const express = require('express');
const bodyParser = require('body-parser');
const drone = require('netology-fake-drone-api');
const router = express.Router();

module.exports = function(mongoose, socketIO) {
  const Order = require('../models/order')(mongoose);

  /**
   * Returns order
   * @param {String} [req.query.userId] - id of user
   * @param {String} [req.query.status] - status of order
   * @return {{_id: String, userId: String, dishId: String, status: String, dishName: String}}
   */
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
    /**
     * Creates a new order
     * @param {String} userId - id of the user the order belongs to
     * @param {String} dishId - id of th dish
     * @param {String} dishName - name of the dish
     */
    .post(function(req, res) {
      const newOrder = new Order();
      newOrder.userId = mongoose.Types.ObjectId(req.body.userId);
      newOrder.dishId = mongoose.Types.ObjectId(req.body.dishId);
      newOrder.dishName = req.body.dishName;
      newOrder.status = 'ordered';

      newOrder.save(function(err) {
        if(err) {
          console.log(err);
          res.status(500);
          res.send('Error in saving order');
        } else {
          res.json({'message': 'Order created', data: newOrder});
          socketIO.emit('server.order.created', newOrder);
        }
      });
    });
  
  /**
   * Updates order
   * @param {String} orderId - od of the order to update
   */
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
                socketIO.emit('server.order.created');
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
                        socketIO.emit('server.order.statuschanged', order);
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
                        socketIO.emit('server.order.statuschanged', order);
                      }
                    })
                  });
              }
            }
          });
        }
      });
    })
    /**
     * Removes order
     * @param {String} req.params.orderId - id of the order to delete
     */
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