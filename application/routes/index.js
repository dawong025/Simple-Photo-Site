var express = require('express');
var router = express.Router();
var isLoggedIn = require("../middleware/routeprotectors").userIsLoggedIn;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'CSC 317 App', name:"Darren Wong" });
});
router.get('/index', (req,res,next) => {
  res.render('index');
});
router.get('/login', (req,res,next) => {
  res.render('login');
});
router.get('/register', (req,res,next) => {
  res.render('register');
});
router.get('/viewpost', (req,res,next) => {
  res.render('viewpost');
});
router.use("/postimage", isLoggedIn);
router.get('/postimage', (req,res,next) => {
  res.render('postimage');
});
router.get('/home', (req,res,next) => {
  res.render('home');
});

module.exports = router;
