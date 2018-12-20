var createError = require('http-errors');
var express = require('express');
var bodyParser=require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var cookieParser = require('cookie-parser');
var compression = require('compression');
var flash = require('express-flash');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


var app = express();


// view engine setup
app.use(compression());
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'pug');
app.use(cookieParser());


// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// BodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json()); // parse application/json 
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
//app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

// Express Session Middleware
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Express Validator Middleware
app.use(expressValidator({
errorFormatter: function(param, msg, value) {
    var namespace = param.split('.')
    , root    = namespace.shift()
    , formParam = root;

  while(namespace.length) {
    formParam += '[' + namespace.shift() + ']';
  }
  return {
    param : formParam,
    msg   : msg,
    value : value
  };
}
}));

// Connect-Flash Middleware
app.use(flash());
app.use(function (req, res, next) {
res.locals.messages = require('express-messages')(req, res);
next();
});

// Define Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

var port = 5000;
app.listen(port, () => {
    console.log('Server is up and running on port numner ' + port);
});
/*User
    .create({
        username: 'loucif', // the property is "username" in model
        password: 'beyou3210',
        admin: 1,
        companyName: 'yassir'
    }, function (err, user) {
        if (err) {
            console.log("Error creating User: ", err);
            
        } else {
            console.log("User Created: ", user);
            
        }
    })*/



module.exports = app;
