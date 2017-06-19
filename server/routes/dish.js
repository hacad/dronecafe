const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

module.exports = function(mongoose) {
  const Dish = require('../models/dish')(mongoose);

  router.route('/')
    .get(function(req, res){
      Dish.find(function(err, dishes){
        if (err) {
          console.log(err);
          res.status(500);
          res.send('Error in getting dishes');
        } else {
          res.json(dishes);
        }
      });
    });
  
  return router;
}