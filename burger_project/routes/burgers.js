'use strict'

var express = require('express');
var burgers = express.Router();
// var db = require('../db/pg');
// var request = require('request');

var burgerData = [];

burgers.route('/')
.get(function(req,res) {
  res.send(burgerData);
})


burgers.route('/new')
  .get(function(req,res) {
	res.send('this will be a new burger form')
  })
  .post(function(req,res) {
    burgerData.push(req.body)
    var newID = burgerData.length-1;
    res.redirect('./'+ newID)
  });

burgers.route('/:burgerID')
.get(function (req, res){
  var bID = req.params.burgerID;
  // if there is not a burger at position :burgerID, throw a non-specific error
  if(!(bID in burgerData)){
    res.sendStatus(404);
    return;
  }
  res.send(burgerData[bID]);
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
