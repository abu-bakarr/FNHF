//importing database
var pool = require('../DbConnect/Db');

module.exports = {

    // index page
    index: (req, res) => {
        res.render('index', {
            pageID: "HOME",
            viewTitle: "Postgres Data",
            pageTitle: "Postgress and Node app",
            data: req.body,

        });
    },

    listview: (req, res) => {
        res.render('listview', {
            pageID: "HOME",
            pageTitle: "Postgress and Node app"
        });
    },

    // posting data route
    addData: (req, res) => {
        info = req.body;
        console.log(info);
        // console.log(req);
        itExist = true

        execute();
        // connecting database
        pool.connect()

      var sqlCheck
      async function execute(){
        try {
          await pool.connect()
              // collecting all nearest health Facility
              var nearhf = await pool.query(`SELECT DISTINCT nearestfacility FROM find_nearest_hf WHERE cellid like $1`, [info.cellid])
              //checking for if row exist find_nearest_hf table in  or not
              var another = await pool.query(`SELECT EXISTS(SELECT 1 FROM find_nearest_hf WHERE cellid like $1)`, [info.cellid])

              if (another.rows[0]['exists'] == true) {
                   console.log("avaiblabe");
                   // inserting into sms_tbl table if codition is meet
                   await pool.query(`INSERT INTO sms_tbl (phone_number, nearestfacility, status, cellid) \
                   VALUES ($1, $2, $3, $4)`, [info.phone_number, nearhf.rows[0].nearestfacility, info.status, info.cellid])
              }else{
                  console.log(`does not exists in database`);

                  }
          }catch(e){
            console.log(e);
          }

        }
        // rendering the same page
        res.render('index', {
            pageID: "HOME",
            viewTitle: "Postgres Data",
            pageTitle: "Postgress and Node app",
            data: sqlCheck
        });
  }

}
