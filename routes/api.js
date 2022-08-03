var express = require('express');
var router = express.Router();
const apiController = require("../controller/apiController");
const { upload,} = require("../middleware/multer.js");


/* GET home page. */
router.get('/landing-page', apiController.landingPage);
router.get('/detail-page/:id', apiController.detailPage);
router.post('/booking-page', upload, apiController.bookingPage);


module.exports = router;
