const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

module.exports = function(mongoose) {
  const Client = require('../models/client')(mongoose);

  router.route('/')
    .get(function(req, res) {
      const searchQuery = {};
  
      if (req.query.name) {
        searchQuery.name = req.query.name;
      }
  
      if (req.query.email) {
        searchQuery.email = req.query.email;
      }
  
      Client.find(searchQuery, function(err, clients) {
        if (err) {
          console.log(err);
          res.status(500);
          res.send('error');
        } else {
          res.json(clients);
        }
      });
    })
    .post(function(req, res) {
      const newClient = new Client();
      newClient.name = req.body.name;
      newClient.email = req.body.email;
      newClient.balance = 100;

      newClient.save(function(err) {
        if(err) {
          console.log(err);
          res.status(500);
          res.send('Error in saving client');
        } else {
          res.status(201);
          res.json(newClient);
        }
      });
    });

  router.route('/:clientId')
    .put(function(req, res) {
      Client.findById(req.params.clientId, function(err, client) {
        if(err) {
          console.log(err);
          res.status(500);
          res.send('Error in updating client');
        } else {
          client.balance = req.body.balance;
          client.save(function(err) {
            if(err) {
              console.log(err);
              res.status(500);
              res.send('Error in updating client');
            } else {
              res.status(200).json({'message': 'client updated'});
            }
          });
        }
      });
    })
    .delete(function(req, res) {
      Client.remove({
        _id: req.params.clientId
      }, function(err) {
        if(err) {
          console.log(`Error in deleting cllient\n${err}`);
          res.status(500);
          res.send('Error in deleting client');
        } else {
          res.json({'message': 'client deleted'});
        }
      });
    });;
    
  return router;
}
