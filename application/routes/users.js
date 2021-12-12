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
const { body, validationResult } = require('express-validator');

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
});

router.post("/login",
body('username').isLength({ min: 3 }),
body('password').isLength({ min: 8 }),
 (req,res,next) => {
  let username = req.body.username;
  let password = req.body.password;

  /*
    do server side validation
  */
   UserModel.authenticate(username,password)
      .then((loggedUserId) => {
        if(loggedUserId > 0){
        successPrint(`User ${username} is logged in`);
        req.session.username = username;
        req.session.userId = loggedUserId;
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
