var express = require("express");
var router = express.Router();

var defaultController = require("../Controller/defaultController");

//route to get and POST
router.route("/school/:id")
    .get(defaultController.allSchoolSms)
    .post(defaultController.addData);

router.route("/report")
    .get(defaultController.allReport)
    .post(defaultController.postReport)

module.exports = router;