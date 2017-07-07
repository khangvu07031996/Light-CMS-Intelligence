var express =require('express'),
    bodyParser = require('body-parser'),
    router = express.Router(),
    mongoose = require('mongoose');
 var app = express();
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : false}));
app.set('view engine', 'ejs');
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

