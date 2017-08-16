let express = require('express'),
  bodyParser = require('body-parser'),
  router = express.Router(),
  mongoose = require('mongoose');

let app = express();
let session = require('express-session');
let path = require('path');
// var cookieParser = require('cookie-parser');
let expressValidator = require('express-validator');
let passport = require('passport');
let flash = require('connect-flash');
let localStrategy = require('passport-local').Strategy;
let exphbs = require('express-handlebars');
let swaggerJSDoc = require('swagger-jsdoc');

let swaggerDefinition = {
  info: {
    title: 'Node Swagger API',
    version: '1.0.0',
    description: 'Demonstrating how to describe a RESTFUL API with Swagger',
  },
  host: 'localhost:3000',
  basepath: '/',
};
let options = {
  swaggerDefinition,
  apis: ['./api/*.js'],
};
let swaggerSpec = swaggerJSDoc(options);
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});
// app.use(cookieParser());
app.use(expressValidator({
  errorFormatter (param, msg, value) {
    var namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  },
}));

// static folder
app.use(express.static(`${__dirname  }/publics`));
// use bodyparser
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true,
}));
app.use(passport.initialize());
app.use(passport.session());


// app.use(require('connect').bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(expressValidator());
// view engine
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

let user = require('./models/user');

app.engine('handlebars', exphbs({ defaultLayout: 'layout' }));
app.set('view engine', 'handlebars');


// Passport init

// connect flash
app.use(flash());

// Global Vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});
app.use(require('./controllers'));
app.use(require('./api'));

mongoose.connect('mongodb://localhost:27017/intelligenceCms', (err) => {
  if (err) {
    console.log('Unable to connect to Mongo.')
    process.exit(1)
  } else {
    var db = mongoose.connection;
    app.listen(3000, function () {
      console.log('Listening on port 3000...')
    })
  }
});

