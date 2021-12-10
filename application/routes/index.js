var express = require('express');
var router = express.Router();
var db = require("../conf/database");
var isLoggedIn = require("../middleware/routeprotectors").userIsLoggedIn;
const {getRecentPosts, getPostById,getCommentsByPostId} = require("../middleware/postsmiddleware");

/* GET home page. */
router.get('/', getRecentPosts, function(req, res, next) {
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
///post/id
router.get("/post/:id(\\d+)", getPostById, getCommentsByPostId, (req,res,next) =>{
  res.render("viewpost", {title: `Post ${req.params.id}`});
});

module.exports = router;
