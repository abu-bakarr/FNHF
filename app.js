var express = require('express');
var app = express();
var fs = require('fs');
var csv = require('fast-csv');
var pool = require('./app/DbConnect/Db');
var bodyParser = require('body-parser');
var timeStamp = require('time-stamp');


console.log(timeStamp.utc('YYYYMMDD'));

// including body parser
app.use(bodyParser.urlencoded({
    extended: true
}));

//setting an environment variable
app.set('port', process.env.PORT || 3030);


// conecting the database
pool.connect()
    .then(() => console.log("Connected successfully"))
    .catch(err => console.log(err))



//setting up a view engine
app.set('view engine', 'ejs');
app.set('views', './app/views'); //specifying the view folder location

//accessing the static files
app.use(express.static('./app/public'));

// Creating access to the routes
app.use(require('./app/routes/mainRouter'), function(req, res, next) {
    next();
});

//listening to the 3000 port
var server = app.listen(app.get('port'), function() {
    console.log('listening on port ' + app.get('port'));

});