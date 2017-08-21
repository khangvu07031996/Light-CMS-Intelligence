const express = require('express');

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const app = express();
const session = require('express-session');
const path = require('path');
// var cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const passport = require('passport');
const flash = require('connect-flash');

const exphbs = require('express-handlebars');
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  info: {
    title: 'Node Swagger API',
    version: '1.0.0',
    description: 'Demonstrating how to describe a RESTFUL API with Swagger',
  },
  host: 'localhost:3000',
  basepath: '/',
};
const options = {
  swaggerDefinition,
  apis: ['./api/*.js'],
};
const swaggerSpec = swaggerJSDoc(options);
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});
// app.use(cookieParser());
app.use(expressValidator({
  errorFormatter(param, msg, value) {
    const namespace = param.split('.');
    const root = namespace.shift();
    let formParam = root;

    while (namespace.length) {
      formParam += `[${namespace.shift()}]`;
    }
    return {
      param: formParam,
      msg,
      value,
    };
  },
}));

// static folder
app.use(express.static(`${__dirname}/publics`));
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

const users = ['John', 'Betty', 'Hal'];

app.get('/api/users', (req, res) => {
  res.json(users);
});

mongoose.connect('mongodb://localhost:27017/intelligenceCms', (err) => {
  if (err) {
    console.log('Unable to connect to Mongo.');
    process.exit(1);
  } else {
    app.listen(3000, () => {
      console.log('Listening on port 3000...');
    });
  }
});

