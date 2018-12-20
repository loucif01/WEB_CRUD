var express = require('express');
var router = express.Router();
var controller = require("../controllers/UserController.js");


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'home' });
});

/* GET subjects page. */
router.get('/subjects', function(req, res, next) {
  res.render('subjects', { title: 'subjects' });
});

/* GET staff page. */
router.get('/staff', function(req, res, next) {
  res.render('staff', { title: 'staff' });
});

/* GET contact page. */
router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'contact' });
});

/* GET home page. */
router.get('/home', function(req, res, next) {
  res.render('home', { title: 'home' });
});

/* GET users. */
router.get('/staff-logged',controller.loggedInOnly,controller.doRead) ;

//route for logout action
router.get('/logout', controller.logout);

/* POST staff page. */
router.post('/staff',controller.doLogin);

// Create a new user
router.post('/staff-logged', controller.doCreate);
 
// Retrieve all user
//router.get('/admin', controller.findAll);

// Update a user 
router.put('/staff-logged', controller.update);

// Delete a user 
router.delete('/staff-logged', controller.delete);
  


module.exports = router;
