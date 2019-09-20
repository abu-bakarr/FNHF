//importing database
var pool = require("../DbConnect/Db");

module.exports = {
    // index page
    allSchoolSms: (req, res) => {
        pool.query('Select * from sms_tbl', (error, results) => {
            if (error) {
                throw error
            }
            res.status(200).json(results.rows)
        })
    },
    allReport: (req, res) => {
        pool.query('Select * from reportschool', (error, results) => {
            if (error) {
                throw error
            }
            res.status(200).json(results.rows)
        })
    },

    // getSingle: (req, res) => {
    //     const id = parseInt(req.params.id)
    //     //console.log(id)
    //     pool.query('SELECT * FROM sms_tbl WHERE cell_id = $1', [id], (error, results) => {
    //         if (error) {
    //             throw error
    //         }
    //         res.status(200).json(results.rows)
    //     })

    // },

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

    postReport: (req, res) => {
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
        const insertReport = function () {
            let nearhf = collectSingleItem();
            nearhf.then(function (result) {
                    let School = result.rows[0].nearest_school;
                    console.log(` This is nearest school Data: ${School}`);
                    return new Promise((resolve, reject, next) => {
                        resolve(pool.query(`INSERT INTO reportschool (phone_number,cell_id,school,region, district, chiefdom, emiscode, issue_reported) \
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`, [info.phone_number, CellID, School, info.region, info.district, info.chiefdom, info.emiscode, info.issue_reported]));
                        reject(new Error('woops'));
                    });

                })
                .catch(e => console.log(e))


        };

        Report();

        // inserting data info
        async function Report() {
            try {
                await pool.connect();
                let recordAVailable = await dataInfo();
                //console.log(recordAVailable)
                if (recordAVailable.rows[0].exists === true) {
                    await insertReport();
                } else {
                    console.log(`does not exists in database`);

                }
            } catch (e) {
                console.log(e);
            }
        }

    },
};