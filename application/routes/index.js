var express = require('express');
var router = express.Router();
var db = require("../conf/database");
var isLoggedIn = require("../middleware/routeprotectors").userIsLoggedIn;
var getRecentPosts = require("../middleware/postsmiddleware").getRecentPosts;

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
router.get("/post/:id(\\d+)", (req,res,next) =>{
  //res.send({params:req.params.id});
  let baseSQL = 
  "SELECT u.id,u.username, p.title, p.description, p.photopath, p.created \
  FROM users u \
  JOIN posts p \
  ON u.id = fk_userId \
  WHERE p.id = ?;";

  let postId = req.params.id;
  db.execute(baseSQL, [postId])
  .then(([results,fields]) => {
    if(results && results.length){
      let post = results[0];
      res.render("viewpost", {currentPost: post});
    }
    else{
      req.flash("error", "This is not the post you are looking for!");
      req.session.save( err => {
        res.redirect("/");
      })
    }
  })
});

module.exports = router;
