//importing database
var pool = require("../DbConnect/Db");

module.exports = {
    // index page
    Home: (req, res) => {
        pool.query('Select * from nearest_school', (error, results) => {
            if (error) {
                throw error
            }
            res.status(200).json(results.rows)
        })
    },

    listview: (req, res) => {
        res.render("listview", {
            pageID: "HOME",
            pageTitle: "Postgress and Node app"
        });
    },

    getSingle: (req, res) => {
        const id = parseInt(req.params.id)
        //console.log(id)
        pool.query('SELECT * FROM sms_tbl WHERE cell_id = $1', [id], (error, results) => {
            if (error) {
                throw error
            }
            res.status(200).json(results.rows)
        })

    },

    // posting data route
    addData: (req, res) => {
        const CellID = req.query.cell_id
        const info = req.query
        console.log(`This is cell id final: ${CellID}`)
        // collecting single Item in find neareast school table in DB
        const collectSingleItem = function () {
            return new Promise((resolve, reject) => {
                resolve(pool.query(
                    `SELECT DISTINCT nearest_school FROM nearest_school WHERE cell_id like $1`, [CellID]
                ));
                reject(new Error('woops'));
            });
        };

        // data availble
        const dataInfo = function () {
            return new Promise((resolve, reject) => {
                resolve(pool.query(
                    `SELECT EXISTS(SELECT 1 FROM nearest_school WHERE cell_id like $1)`, [CellID]
                ));
                reject(new Error('Error in selecting Distinct'));
            });
        };
        // insert data in sms table
        const insertSmsData = function () {
            let nearhf = collectSingleItem();
            nearhf.then(function (result) {
                let NearestSchool = result.rows[0].nearest_school;
                console.log(` This is nearest school Data: ${NearestSchool}`);
                return new Promise((resolve, reject, next) => {
                    resolve(pool.query(`INSERT INTO sms_tbl (phone_number, nearest_school, status, cell_id) \
                    VALUES ($1, $2, $3, $4)`, [info.phone_number, NearestSchool, info.status, CellID]));
                    reject(new Error('woops'));
                    next()
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
                //console.log(recordAVailable)
                if (recordAVailable.rows[0].exists === true) {
                    await insertSmsData();
                } else {
                    console.log(`does not exists in database`);

                }
            } catch (e) {
                console.log(e);
            }
        }

    },


};