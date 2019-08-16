var express = require('express');
var router = express.Router();

var defaultController = require('../Controller/defaultController');

router.route('/')
    .get(defaultController.index);