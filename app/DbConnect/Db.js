var csv = require('csvtojson');
var pg = require('pg');
var { Pool } = require('pg');

// setting pool from class Pool in postgress
var pool = new Pool({
    "user": "postgres",
    "password": "lovel",
    "host": "localhost",
    "port": 5432,
    "database": "FNHF"
});




// handling error if occur
pool.on('error', function(err, pool) {
    console.error("connection fail", err.message, err.stack);

});

module.exports = pool;