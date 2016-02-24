'use strict';

require('dotenv').config();
var pg = require('pg');
var connectionString = 'postgres://sarashorowitz:' +process.env.DB_password + '@localhost/burgers';


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
    var cheeses= req.body.cheeses;
    var toppings = req.body.extras;
    console.log(req.body);

    var query = client.query("INSERT INTO orders (name,meat_id,bun_id,doneness) VALUES($1,$2,$3, $4) RETURNING order_id",
    [name, meat_id, bun_id, doneness],
     function(err, results){
      done();
      if(err) {
       return console.error('error running query', err);
      }
      res.rows = results.rows;

      var cheesearr;
      if (typeof(req.body.cheeses) === 'string'){
        cheesearr =[req.body.cheeses];
      }else {
        cheesearr = req.body.cheeses;
      }

      cheesearr.forEach(function(cheese,index) {
        var query = client.query('INSERT INTO cheeses_orders_join (order_id, cheese_id) VALUES ($1, $2)',
        [res.rows[0].order_id, parseInt(cheese)],
        function (err, results) {
          if (err) {
            console.error('Error with query', err);
          }
          if (index === cheeses.length - 1) {
            done();
          }
        })
      })

      var toppingarr;
      if (typeof(req.body.extras) === 'string'){
        toppingarr =[req.body.extras];
      }else {
        toppingarr = req.body.extras;
      }

      toppingarr.forEach(function(topping,index) {
      var query = client.query('INSERT INTO toppings_orders_join (order_id, topping_id) VALUES ($1, $2)',
      [res.rows[0].order_id, parseInt(topping)],
      function (err, results) {
        if (err) {
          console.error('Error with query', err);
        }
        if (index === toppings.length - 1) {
          done();
          next();
        }
      })
    })
    });
})
}

function showOneBurger(req,res,next){
  pg.connect(connectionString, function(err, client, done){
    if(err){
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    var query = client.query(`SELECT justcheeses.order_id, justcheeses.name, meats_name, buns_name, cheeses, array_agg(toppings.name) as toppings
    FROM (
    SELECT o.order_id, o.name, meats.name as meats_name, buns.name as buns_name, array_agg(cheeses.name) as cheeses
    FROM orders o
    INNER JOIN meats on meats.meat_id = o.meat_id
    LEFT JOIN buns on buns.bun_id = o.bun_id
    INNER JOIN cheeses_orders_join
    ON o.order_id = cheeses_orders_join.order_id
    LEFT JOIN cheeses
    ON cheeses.cheese_id = cheeses_orders_join.cheese_id
    GROUP BY (o.order_id, meats.name, buns.name)
    ORDER BY (o.order_id)
    ) as justcheeses
    INNER JOIN toppings_orders_join
    ON toppings_orders_join.order_id = justcheeses.order_id
    LEFT JOIN toppings
    ON toppings.topping_id = toppings_orders_join.topping_id
    WHERE justcheeses.order_id = $1
    GROUP BY justcheeses.order_id, justcheeses.name, meats_name, buns_name, cheeses;`, [req.params.id],
     function(err, results){
      done();
      if(err) {
       return console.error('error running query', err);
      }
      res.rows = results.rows;
      next();
    });
  });
}

function showAllBurgers(req, res, next) {
  pg.connect(connectionString, function(err, client, done) {
    if(err){
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    var query = client.query(`SELECT justcheeses.order_id, justcheeses.name, meats_name, buns_name, cheeses, array_agg(toppings.name) as toppings
    FROM (
    SELECT o.order_id, o.name, meats.name as meats_name, buns.name as buns_name, array_agg(cheeses.name) as cheeses
    FROM orders o
    INNER JOIN meats on meats.meat_id = o.meat_id
    LEFT JOIN buns on buns.bun_id = o.bun_id
    INNER JOIN cheeses_orders_join
    ON o.order_id = cheeses_orders_join.order_id
    LEFT JOIN cheeses
    ON cheeses.cheese_id = cheeses_orders_join.cheese_id
    GROUP BY (o.order_id, meats.name, buns.name)
    ORDER BY (o.order_id)
    ) as justcheeses
    INNER JOIN toppings_orders_join
    ON toppings_orders_join.order_id = justcheeses.order_id
    LEFT JOIN toppings
    ON toppings.topping_id = toppings_orders_join.topping_id
    GROUP BY justcheeses.order_id, justcheeses.name, meats_name, buns_name, cheeses;`, function(err, results){
     done();
     if(err) {
      return console.error('error running query', err);
     }
     res.rows = results.rows;
     next();
   });
 })
}


module.exports.createBurger = createBurger;
module.exports.showOneBurger = showOneBurger;
module.exports.showAllBurgers = showAllBurgers;
