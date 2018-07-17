
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/users')
  , http = require('http')
  , path = require('path')
  , favicon = require('serve-favicon')
  , logger = require('morgan')
  , cookieParser = require('cookie-parser')
  , session = require('express-session')
  , expressValidator = require('express-validator')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , bodyParser = require('body-parser')
  , multer = require('multer')
  , flash = require('connect-flash')
  , mongo = require('mongodb')
  , mongoose = require('mongoose');


  
  //db connection ---------------------
  
  var uri = 'mongodb://0.0.0.0/sportello-amico';
//var uri = 'mongodb://localhost/sportello-amico';
mongoose.connect(process.env.MONGODB_URI || uri);



var db = mongoose.connection;

var routes = require("./routes/index");
var users = require("./routes/users");
var candidats = require("./routes/candidats");

var app = express();

var env = process.env.NODE_ENV || 'development';
	if ('development' == env) {
	   // configure stuff here
		app.use("/", routes);
		app.use("/users", users);
		app.use("/candidats", candidats);  
	} else {
	   app.use("/", routes);
		app.use("/users", users);
		app.use("/candidats", candidats);
	}


app.server = http.createServer(app);


// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", 'jade');


// Handle file uploads
app.use(multer({dest:'./uploads'}));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Handle Express Sessions
app.use(session({
    secret:'sportello secrets',
    saveUninitialized: true,
    resave: true
}));

// passport
app.use(passport.initialize());
app.use(passport.session());

// Validator
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

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});



app.get('*', function(req, res, next){
    res.locals.user = req.user || null;
    next();
});


//For avoidong Heroku $PORT error
app.get('/', function(request, response) {
    var result = 'App is running'
    response.send(result);
}).listen(app.get('port'), function() {
    console.log('App is running, server is listening on port ', app.get('port'));
});


/*
app.get('/', function (req, res) {
  res.render("index");
});

app.get('/users/login', function (req, res) {
  res.render("login");
});

app.get('/users/register', function (req, res) {
  res.render("register");
});


app.post('/users/register', function (req, res) {
  
  res.send("/users/register");
});
*/

app.use("/", routes);
app.use("/users", users);
app.use("/candidats", candidats);




/*
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
*/
// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

/*
app.server.listen(process.env.PORT || 3000, process.env.IP, function(){
  var addr = app.server.address();
  //and... we're live
  console.log("Server server listening at", addr.address + ":" + addr.port);
});


server.listen(process.env.PORT || 3000, process.env.IP || "localhost", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});
*/

module.exports = app;