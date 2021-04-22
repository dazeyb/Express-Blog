// require
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const db = require("../models");

/* 
  GET - /register Presentational Form
  POST - /register functional route
  GET - /login Presentational Form
  POST - /login functional
*/

router.get("/register", function(req,res){
  res.render("auth/register");
});

router.post("/register", async function(req,res){
  try {
  // step check if user exists 
  const foundUser = await db.User.findOne({email: req.body.email});
  // if so redirect to login 
  if(foundUser){
    return res.redirect("/login");
  }
  // if not create user and redirect to login

	// salt will created a more complicated hash
  const salt = await bcrypt.genSalt(10);
	// hash will convert our password into something more secure
	// test1234 => "$2a$10$5vR9VhGpkARz6EFPdkuNQ.aZNRGUgSCNSKEb9Xp1IKzrfxYETlkB2"
  const hash = await bcrypt.hash(req.body.password, salt);
  
  req.body.password = hash;

	// create user in database
  const newUser = await db.User.create(req.body);
  
  return res.redirect("/login");

  } catch(err){
    console.log(err);
    return res.send(err);
  }
});

router.get("/login",function(req,res){
  res.render("auth/login");
});

router.post("/login",function(req,res){
  res.send(req.body);
});

module.exports = router;