'use strict';

var pg = require('pg');
var connectionString = "postgres://sarashorowitz:Bugs3588@localhost/burgers";

function createBurger(req,res,next){
  pg.connect(connectionString, function(err, client, done){
    if(err){
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    var name = req.body.name;
    var meat_id = parseInt(req.body.meat);
    var bun_id = parseInt(req.body.buns);
    var doneness = req.body.temperature;

    var query = client.query("INSERT INTO orders (name,meat_id,bun_id,doneness) VALUES($1,$2,$3, $4)",
    [name, meat_id, bun_id, doneness],
     function(err, result){
      done();
      if(err) {
       return console.error('error running query', err);
      }
      next();
    });
  });
}

function showOneBurger(req,res,next){
  pg.connect(connectionString, function(err, client, done){
    if(err){
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    var query = client.query("SELECT * FROM orders ORDER BY order_id DESC LIMIT 1",
     function(err, result){
      done();
      if(err) {
       return console.error('error running query', err);
      }
      res.rows = result.rows;
      next();
    });
  });
}


module.exports.createBurger = createBurger;
module.exports.showOneBurger = showOneBurger;
