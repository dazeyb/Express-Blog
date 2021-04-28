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
  DELETE - /logout functional
*/

router.get("/register", function (req, res) {
  res.render("auth/register");
});

router.post("/register", async function (req, res) {
  try {
    // step check if user exists
    const foundUser = await db.User.findOne({ email: req.body.email });
    // if so redirect to login
    if (foundUser) {
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
  } catch (err) {
    console.log(err);
    return res.send(err);
  }
});

router.get("/login", function (req, res) {
  res.render("auth/login");
});

router.post("/login", async function (req, res) {
  try {
    // check if the user exists
    const foundUser = await db.User.findOne({ email: req.body.email });
    // if not
    // redirect to register
    if (!foundUser) return res.redirect("/register");

    // if the user exists
    // validate the user if passwords match -> login
    // .compare(body password, hashed password) => return true or false
    const match = await bcrypt.compare(req.body.password, foundUser.password);

    // if not match send error
    if (!match) return res.send("password invalid");

    // if match create the session and redirect to home\
    // here we have created the key card
    req.session.currentUser = {
      id: foundUser._id,
      username: foundUser.username,
    };

    return res.redirect("/");
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

router.delete("/logout", async function (req, res) {
  await req.session.destroy();
  return res.redirect("/");
});

module.exports = router;
