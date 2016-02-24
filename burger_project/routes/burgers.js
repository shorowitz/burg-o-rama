'use strict'

var express = require('express');
var burgers = express.Router();
var db = require('../db/pg');
var bodyParser = require('body-parser');

var burgerData = [];

burgers.route('/')
.get( db.showAllBurgers, function(req,res) {
  res.render('./pages/burgers-all.html.ejs', {data: res.rows});
})
.post(db.createBurger, function(req,res) {
  res.redirect('./' + res.rows[0].order_id);
  // console.log(req.body);
});


burgers.route('/new')
  .get(function(req,res) {
	res.render('./pages/burgers-edit.html.ejs', {
    data:{
   title:'Create your Dream Burger',
   burgerURL:'/burgers/',
   submitMethod:'post'
    }
  });
});


burgers.route('/:id')
.get(db.showOneBurger, function (req, res){
  console.log(res.rows)
  // if there is not a burger at position :burgerID, throw a non-specific error
  // if(!(bID in burgerData)){
  //   res.sendStatus(404);
  //   return;
  // }
  res.render('./pages/burger-one.html.ejs', {data: res.rows[0]})
})
.put(function(req,res){
    var bID = req.params.burgerID;
    console.log("PUUUUUUUT", req.body)
    // if we don't have a burger there, let's
    if(!(bID in burgerData)){
      res.sendStatus(404);
      return;
    }
    burgerData[bID] = req.body;

    //redirect to the new burger
    res.redirect('./' + bID);
  })

.delete(function(req, res) {
  var bID = req.params.burgerID;
  console.log('Im deleting');
  if(!(bID in burgerData)){
    res.sendStatus(404);
    return;
  };
  burgerData.splice(bID, 1);
  res.redirect('./')
  })

module.exports = burgers;
