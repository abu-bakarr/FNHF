var express = require('express');
var app = express();
var fs = require('fs');
var csv = require('fast-csv');
var pool = require('./app/DbConnect/Db');
var bodyParser = require('body-parser');
var timeStamp = require('time-stamp');


console.log(timeStamp.utc('YYYYMMDD'));

// including body parser
app.use(bodyParser.urlencoded({ extended: true }));

//setting an environment variable
app.set('port', process.env.PORT || 3030);

// setting a counter to import csv file
//var counter = 0;

// pool function to connect to database
// pool.connect(function(err) {
//     if (!err) {
//         console.log("connected.......");
//     } else {
//         console.log(err);
//     }
// });

// conecting the database
pool.connect()
    .then(() => console.log("Connected successfully"))
    // .then(() => pool.query("SELECT * FROM find_nearest_hf"))
    // .then(result => console.table(result.rows))
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



//retreiving data from the csv file
// var csvStream = csv.parseFile(".\\excell\\Final_file_2.csv", { headers: true })
//     .on("data", function(record) {
//         // pausing before checking
//         csvStream.pause();

//         if (counter < 2664) {
//             var siteNum = record.S_N;
//             var Lat = record.LAT;
//             var Long = record.LONG;
//             var Mcc = record.MCC;
//             var Mnc = record.MNC;
//             var nearestFacility = record.NEAREST_FACILITY;
//             var siteId = record.Site_ID;
//             var siteRName = record.Site_RName;
//             var cellId = record.Cell_ID;
//             var cellName = record.Cell_Name;

//             // inserting data to the database
//             pool.query("INSERT INTO find_nearest_hf(siteNum, Lat, Long,Mcc,Mnc,nearestFacility,siteId,siteRName,cellId, cellName) \
//                     VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)", [siteNum, Lat, Long, Mcc, Mnc, nearestFacility, siteId, siteRName, cellId, cellName], function(err) {
//                 if (err) {
//                     console.log(err);
//                 }
//             });
//             ++counter;
//         }
//         // file storing complete
//         csvStream.resume();
//         // callbackfunction
//     }).on("end", function() {
//         console.log("Done.....");
//     }).on("error", function(err) {
//         console.log(err);
//     })

//listening to the 3000 port
var server = app.listen(app.get('port'), function() {
    console.log('listening on port ' + app.get('port'));

});
