var express = require('express');
var router = express.Router();
const adminController = require("../controller/adminController");
const { upload, uploadMultiple } = require("../middleware/multer.js");
const auth = require("../middleware/auth");

/* GET home page. */
router.get('/signin', adminController.viewSignin);
router.post('/signin', adminController.actionSignin);

router.use(auth)
router.get('/signout', adminController.actionSignout);
router.get('/dashboard', adminController.viewDashboard);

//end point category
router.get('/category', adminController.viewCategory);
router.post('/category', adminController.addCategory);
router.put('/category', adminController.updateCategory);
router.delete('/category/:id', adminController.deleteCategory);

//end point bank
router.get('/bank', adminController.viewBank);
router.post('/bank', upload, adminController.addBank);
router.put('/bank', upload, adminController.updateBank);
router.delete('/bank/:id', adminController.deleteBank);

//end point item
router.get('/item', adminController.viewItem);
router.get('/item/show-image/:id', adminController.showImageItem);
router.get('/item/edit-image/:id', adminController.showEditItem);
router.post('/item', uploadMultiple, adminController.addItem);
router.put('/item', uploadMultiple, adminController.updateItem);
router.delete('/item/:id', adminController.deleteItem);

//end point item detail
//feature
router.get('/item/show-detail-item/:itemId', adminController.viewDetailItem);
router.post('/item/add/feature', upload, adminController.addFeature);
router.put('/item/edit/feature', upload, adminController.updateFeature);
router.delete('/item/feature/:itemId/:id', adminController.deleteFeature);

//activity
router.post('/item/add/activity', upload, adminController.addActivity);
router.put('/item/edit/activity', upload, adminController.updateActivity);
router.delete('/item/activity/:itemId/:id', adminController.deleteActivity);

//booking
router.get('/booking', adminController.viewBooking);
router.get('/booking/:id', adminController.showDetailBooking);
router.put('/booking/:id/confirmation', adminController.actionConfirmation);
router.put('/booking/:id/rejection', adminController.actionRejection);


module.exports = router;
