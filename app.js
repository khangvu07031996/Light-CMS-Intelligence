var express =require('express'),
    bodyParser = require('body-parser'),
    router = express.Router(),
    mongoose = require('mongoose');
 var app = express();
 var session = require('express-session');
 var path = require('path');
 var cookieParser = require('cookie-parser');
 var expressValidator = require('express-validator');
 var passport = require('passport');
 var flash = require('connect-flash');
 var localStrategy = require('passport-local').Strategy;
 var exphbs = require('express-handlebars'); 
app.use(cookieParser());

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

//static folder
app.use(express.static(__dirname + '/publics'))
//use bodyparser
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : false}));
app.use(expressValidator());
//view engine
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');

var user = require('./models/user');
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

app.set('view options', { layout: 'other' });


// Passport init

//connect flash
app.use(flash());

// Global Vars

app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

app.use(require('./controllers'))
mongoose.connect('mongodb://localhost:27017/intelligenceCms',function(err){
if (err) {
    console.log('Unable to connect to Mongo.')
    process.exit(1)
  } else {
    var db = mongoose.connection;
    app.listen(3000, function() {
      console.log('Listening on port 3000...')
    })
  }
})

