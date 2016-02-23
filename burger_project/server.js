'use strict'
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var logger = require('morgan');
var burgerRoutes = require(path.join(__dirname, '/routes/burgers'));

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
app.set('view engine', 'ejs');

//routes
app.get('/', function (req, res) {
  res.send('Burger Home');
});

//Burger routes
app.use('/burgers', burgerRoutes);

app.listen(port,()=>
  console.log('Im listening on', port,'//', new Date())
)
