var express =require('express'),
    bodyParser = require('body-parser'),
    router = express.Router(),
    mongoose = require('mongoose');
 var app = express();
 var path = require('path');
 var exphbs = require('express-handlebars');
app.use(express.static(__dirname + '/publics'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : false}));
//view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(require('./controllers'))

//app.engine('handlebars', exphbs({defaultLayout:'layout'}));
//app.set('view engine', 'handlebars');
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

