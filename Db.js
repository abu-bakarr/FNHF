var csv = require('csvtojson');
var pg = require('pg');
var { Pool } = require('pg');

var pool = new Pool({
    "user": "postgres",
    "password": "lovel",
    "host": "localhost",
    "port": 5432,
    "database": "FNHF"
});

pool.connect(function(err) {
    if (err) {
        console.log(err);
    }
});



pool.on('error', function(err, pool) {
    console.error("connection fail", err.message, err.stack);

});

module.exports = pool;