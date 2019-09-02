//importing database
var pool = require("../DbConnect/Db");

module.exports = {
    // index page
    index: (req, res) => {
        res.render("index", {
            pageID: "HOME",
            viewTitle: "Postgres Data",
            pageTitle: "Postgress and Node app",
            data: req.body
        });
    },

    listview: (req, res) => {
        res.render("listview", {
            pageID: "HOME",
            pageTitle: "Postgress and Node app"
        });
    },

    // posting data route
    addData: (req, res) => {
        info = req.body;

        // collecting single Item in find neareast hf table in DB
        const collectSingleItem = function() {
            return new Promise((resolve, reject) => {
                resolve(pool.query(
                    `SELECT DISTINCT nearestfacility FROM find_nearest_hf WHERE cellid like $1`, [info.cellid]
                ));
                reject(new Error('woops'));
            });
        };

        // data availble
        const dataInfo = function() {
            return new Promise((resolve, reject) => {
                resolve(pool.query(
                    `SELECT EXISTS(SELECT 1 FROM find_nearest_hf WHERE cellid like $1)`, [info.cellid]
                ));
                reject(new Error('woops'));
            });
        };
        // insert data in sms table
        const insertSmsData = function() {
            let nearhf = collectSingleItem();
            nearhf.then(function(result) {
                let healthfacility = result;
                return new Promise((resolve, reject) => {
                    resolve(pool.query(`INSERT INTO sms_tbl (phone_number, nearestfacility, status, cellid) \
                    VALUES ($1, $2, $3, $4)`, [info.phone_number, healthfacility.rows[0].nearestfacility, info.status, info.cellid]));
                    reject(new Error('woops'));
                });

            });


        };

        execute();
        // connecting database
        pool.connect();

        // inserting data info
        async function execute() {
            try {
                await pool.connect();
                let recordAVailable = await dataInfo();
                if (recordAVailable.rows[0].exists == true) {
                    await insertSmsData();
                } else {
                    console.log(`does not exists in database`);

                }
            } catch (e) {
                console.log(e);
            }
        }

        // rendering the same page
        res.render("index", {
            pageID: "HOME",
            viewTitle: "Postgres Data",
            pageTitle: "Postgress and Node app"
        });
    },


};