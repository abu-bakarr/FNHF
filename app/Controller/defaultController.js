var pool = require('../DbConnect/Db');

module.exports = {

    // index
    index: (req, res) => {
        res.render('index', {
            pageID: "HOME",
            viewTitle: "Postgres Data",
            pageTitle: "Postgress and Node app",
            data: req.body
        });
    },
    listview: (req, res) => {
        res.render('listview', {
            pageID: "HOME",
            pageTitle: "Postgress and Node app"
        });
    },
    addData: (req, res) => {
        info = req.body;
        console.log(info);
        console.log(req);

        pool.connect()

           .then(() => pool.query("SELECT EXISTS(SELECT 1 FROM find_nearest_hf WHERE cellid == $1`, [info.cellId]"))
           .then(result => console.table(result.rows))
          //.then(() => pool.query(`SELECT EXISTS(SELECT 1 FROM find_nearest_hf WHERE cellid == $1`, [info.cellId]))
           .then(() => pool.query(`INSERT INTO session_tbl (sitename, cellid, cellname, nearesthf) \
                 VALUES ($1, $2, $3, $4)`, [info.siteName, info.cellId, info.cellname, info.nearestfacility]))
            .catch(e => console.log(e));

        res.render('listview', {
            pageID: "HOME",
            viewTitle: "Postgres Data",
            pageTitle: "Postgress and Node app",
            data: info
        });

        console.log(info);
    }

}
