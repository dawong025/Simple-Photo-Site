var express = require('express');
var router = express.Router();
var db = require("../conf/database");
const UserModel = require("../models/Users");
const UserError = require ("../helpers/error/UserError");
const {
  errorPrint,
  successPrint
} = require ("../helpers/debug/debugprinters");
var bcrypt = require ("bcrypt");
const{registerValidator} = require("../middleware/validation");
const{loginValidator} = require("../middleware/validation");

/*
//GET users listing. 
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
*/

router.post("/register", registerValidator, (req,res,next) => {
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  let cpassword = req.body.conf-password;

  UserModel.usernameExists(username)
  .then((userDoesNameExist) => {
    if(userDoesNameExist){
      throw new UserError(
        "Registration Failed: Username already exists",
        "/register",
        200
      );
    }
    else{
      return UserModel.emailExists(email);
    }
  })
  .then((emailDoesExist) =>{
    if(emailDoesExist){
      throw new UserError(
        "Registration Failed: Email already exists",
        "/register",
        200
      );
    }
    else{
      return UserModel.create(username, password, email);
    }
  })
  .then((createdUserId) => {
    if(createdUserId < 0){
      throw new UserError(
        "Server Error: User could not be created",
        "/registration",
        500
      );
    }
    else{
      successPrint("User.js --> user was created!!");
      req.flash("success", "User account has been made");
      req.session.save(err=>{
        res.redirect("/login");
      })
    }
  })
  .catch((err) => {
    errorPrint("user could not be made", err);
    if(err instanceof UserError){
      errorPrint(err.getMessage());
      req.flash("error", err.getMessage());
      res.status(err.getStatus());
      res.redirect(err.getRedirectURL());
    }
    else{
      next(err);
    }
  });
  /*
  db.execute("SELECT * FROM users WHERE username=?",[username])
  .then(([results,fields]) => {
    if(results && results.length == 0){
      return db.execute("SELECT * FROM users WHERE email=?",[email]);
    }
    else{
      throw new UserError(
        "Registration Failed: Username already exists",
        "/register",
        200
      );
    }
  })
  .then(([results,fields]) => {
  if(results && results.length == 0){
    return bcrypt.hash(password, 15);
  }
  else{
    throw new UserError(
      "Registration Failed: Email already exists",
      "/register",
      200
    )
  }
  })
  .then((hashedPassword) => {
    let baseSQL = "INSERT INTO users (username, email, password, created) VALUES (?,?,?, now());";
    return db.execute(baseSQL,[username,email,hashedPassword]);
  })
  .then(([results,fields]) =>{
    if(results && results.affectedRows){
      successPrint("User.js --> user was created!!");
      req.flash("success", "User account has been made");
      req.session.save(err=>{
        res.redirect("/login");
      })
      //res.redirect("/login");
    }
    else{ 
      throw new UserError(
        "Server Error: User could not be created",
        "/registration",
        500
      );
    }
  })
  .catch((err) => {
    errorPrint("user could not be made", err);
    if(err instanceof UserError){
      errorPrint(err.getMessage());
      req.flash("error", err.getMessage());
      res.status(err.getStatus());
      res.redirect(err.getRedirectURL());
    }
    else{
      next(err);
    }
  });
  */
});

router.post("/login", loginValidator, (req,res,next) => {
  let username = req.body.username;
  let password = req.body.password;

  /*
    do server side validation
  */
  /*
    let baseSQL = "SELECT id, username, password FROM users WHERE username=?;";
    let userId;
    db.execute(baseSQL,[username])
    .then(([results, fields]) => {
        if(results && results.length == 1){
          let hashedPassword = results[0].password;
          userId = results[0].id;
          return bcrypt.compare(password, hashedPassword);
        }
        else{
          throw new UserError ("invalid username and/or password", "/login", 200);
        }
    })
    */
   UserModel.authenticate(username,password)
    //.then((passwordsMatched) => {
      .then((loggedUserId) => {
      //if(passwordsMatched){
        if(loggedUserId){
        successPrint(`User ${username} is logged in`);
        //res.cookie("logged",username, {expires: new Date(Date.now()+900000), httpOnly: false});
        req.session.username = username;
        req.session.userId = userId;
        res.locals.logged = true;
        req.flash("success", "You have been successfully logged in!");
        req.session.save(err=>{
          res.redirect("/");
        })
      }
      else{
        throw new UserError ("Invalid username and/or password", "/login", 200);
      }
    })
    .catch((err) => {
      errorPrint("User login failed");
      if(err instanceof UserError){
        errorPrint(err.getMessage());
        req.flash("error", err.getMessage());
        res.status(err.getStatus());
        req.session.save(err=>{
          res.redirect("/login");
        })
        //res.redirect("/login");
      }
      else{
        next(err);
      }
    });
});

router.post("/logout", (req,res,next) => {
  req.session.destroy((err) => {
    if(err){
      errorPrint("Session could not be destroyed.");
      next(err);
    }
    else{
      successPrint("Session was destroyed");
      res.clearCookie("csid");
      res.json({status: "OK", message: "User is logged out"});
    }
  })
});

module.exports = router;
