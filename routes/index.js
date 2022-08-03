var express = require('express');
var router = express.Router();

const userController = require("../controller/userController");


/* GET home page. */

router.get('/', function(req, res, next) {
    res.redirect('/admin/signin')
});


module.exports = router;
