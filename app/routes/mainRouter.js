var express = require('express');
var router = express.Router();

var defaultController = require('../Controller/defaultController');

router.route('/')
    .get(defaultController.index)
    .post(defaultController.addData);

router.route('/list')
    .get(defaultController.listview);


module.exports = router;