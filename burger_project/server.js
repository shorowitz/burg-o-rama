'use strict'
require('dotenv').config();
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var logger = require('morgan');
var burgerRoutes = require(path.join(__dirname, '/routes/burgers'));
var pg = require('pg');
var connectionString = 'postgres://sarashorowitz:' + process.env.DB_password + '@localhost/burgers';
var db = require('./db/pg');


//app settings
var app = express();
var port = process.env.PORT || 3000;

//parse incoming forms
app.use( bodyParser.urlencoded({ extended: false }));
app.use( bodyParser.json());

// override POST having ?_method=XXXX
app.use(methodOverride('_method'));

// static route to public
app.use(express.static(path.join(__dirname, 'public')));

app.use(logger('dev'));

//views
app.set('views', './views');
app.set('view engine', 'ejs');

//routes
app.get('/', function (req, res) {
  res.render('./pages/home.html.ejs');
});

//Burger routes
app.use('/burgers', burgerRoutes);

app.listen(port, function(req, res) {
  console.log('Im listening on', port,'//', new Date())
})
