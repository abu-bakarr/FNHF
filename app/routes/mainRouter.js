var express = require('express');
var router = express.Router();

var defaultController = require('../Controller/defaultController');

//route to get and POST
router.route('/')
    .get(defaultController.Home)
    .post(defaultController.addData)

router.route('/:id')
    .get(defaultController.getSingle)


router.route('/list')
    .get(defaultController.listview);


module.exports = router;