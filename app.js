var fs = require('fs');
var csv = require('fast-csv');
var pool = require('./Db');

// setting a counter
var counter = 0;

// pool function to connect to database
pool.connect(function(err) {
    if (!err) {
        console.log("connected.......");
    } else {
        console.log(err);
    }
});


//retreiving data from the csv file
var csvStream = csv.parseFile(".\\excell\\Final_file_2.csv", { headers: true })
    .on("data", function(record) {
        // pausing before checking 
        csvStream.pause();

        if (counter < 2664) {
            var siteNum = record.S_N;
            var Lat = record.LAT;
            var Long = record.LONG;
            var Mcc = record.MCC;
            var Mnc = record.MNC;
            var nearestFacility = record.NEAREST_FACILITY;
            var siteId = record.Site_ID;
            var siteRName = record.Site_RName;
            var cellName = record.Cell_Name;

            // inserting data to the database
            pool.query("INSERT INTO find_nearest_hf(siteNum, Lat, Long,Mcc,Mnc,nearestFacility,siteId,siteRName,cellName) \
                    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)", [siteNum, Lat, Long, Mcc, Mnc, nearestFacility, siteId, siteRName, cellName], function(err) {
                if (err) {
                    console.log(err);
                }
            });
            ++counter;
        }
        // file storing complete
        csvStream.resume();
        // callbackfunction 
    }).on("end", function() {
        console.log("Done.....");
    }).on("error", function(err) {
        console.log(err);
    })