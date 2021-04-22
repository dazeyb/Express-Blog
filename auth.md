# Auth 

## Authentication
Is WHO you are.

example: Key Card

### Sessions + Cookie === Keycard

## Authorization 
WHAT you are allowed to access.

example: Looking at the key/ using the keycard to gain to access 

### Middleware to Look at the cookie to validate the user


## Set up

Packages required for Authentication and Authorization: 

- express-session (To make the sessions + cookies)
- connect-mongo (To store the sessions in mongodb)
- bcryptjs (Hash and Salt Password)

```bash
npm i express-session connect-mongo bcryptjs
```

1. Set up mongostore and session 
server.js
```js 
/* ==== External Modules ==== */
//..
const session = require("express-session");
const MongoStore = require("connect-mongo");
```

2. Set up session configuration 

server.js 

```js 
/* ==== Middleware ==== */
//...

// setup session middleware 
// session(config object)
app.use(session({
	// where to store the sessions in mongodb
	store: MongoStore.create({ mongoUrl: "mongodb://localhost:27017/blogdb"}),
	// secret key is used to sign every cookie to say its is valid
	secret: "Super Secret Waffles",
	resave: false,
	saveUninitialized: false,
	// configure the experation of the cookie
	cookie: {
		maxAge: 1000 * 60 * 60 * 24 * 7 * 2 // two weeks
	}
}));
```

3. Adding users to our db by creating a User model

Create a User.js in Models
```js 
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {type: String, required: [true, "Please Provide An Email Address."], unique: true },
    password: {type: String, required: [true, "Please Provide A Password"], unique: true },
    username: {type: String, required: true, unique: true}
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
```

>NOTE: Do not forget to require in the models/index.js!

4. Add a route an auth controller to handle the Register Requests

In controllers create an auth.js 
```js 
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


module.exports = router;
```

>NOTE: Do not forget to require in the controllers/index.js!

5. Require the controller in the server.js 

server.js 

```js 
* ==== Routes/Controllers ==== */
//...

// authentication and authorization
app.use("/", controllers.auth);

// author controller
app.use("/authors", controllers.authors);

// article controller
app.use("/articles", controllers.articles);
```

6. Stub up the Routes you will need in the Auth Controller

auth.js

```js 
//...

router.get("/register", function(req,res){
  res.render("auth/register");
});

router.post("/register", async function(req,res){
  res.send(req.body);
});

router.get("/login",function(req,res){
  res.render("auth/login");
});

router.post("/login", async function(req,res){
  res.send(req.body);
});
```

7. Create the ejs for Register and Login 

In the views directory create a new directory labeled auth. Inside the auth directory create two new ejs fills labeled register.ejs and login.ejs.

register.ejs
```html 
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Register</title>
</head>
<body>
  <h1>Register for an Account</h1>

  <form action="/register" method="POST">
    <p>
      <input type="text" name="username" placeholder="Username" required minlength="5">
    </p>
    <p>
      <input type="email" name="email" placeholder="Email"  required>
    </p>
    <p>
      <input type="password" name="password" placeholder="Password"  required minlength="8">
    </p>

    <input type="submit" value="Register">
  </form>
  
</body>
</html>
```

login.ejs
```html 
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login</title>
</head>
<body>
  <h1>Welcome Back!</h1>

  <form action="/login" method="POST">
    <p>
      <input type="email" name="email" placeholder="Email"  required>
    </p>
    <p>
      <input type="password" name="password" placeholder="Password"  required minlength="8">
    </p>
    <input type="submit" value="Login">
  </form>
  
</body>
</html>
```

8. Refactor the update route to create a user. 

controllers/auth.js

```js 
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
```

9. Time to add Authentication with the Post Login Route

controllers/auth.js

```js 

router.post("/login", async function(req,res){
  try {
   // check if the user exists 
   const foundUser = await db.User.findOne({email: req.body.email});
   // if not
     // redirect to register
  if(!foundUser) return res.redirect("/register");

  // if the user exists
    // validate the user if passwords match -> login 
    // .compare(body password, hashed password) => return true or false
  const match = await bcrypt.compare(req.body.password, foundUser.password);

  // if not match send error
  if(!match) return res.send("password invalid");

  // if match create the session and redirect to home\
  // here we have created the key card
  req.session.currentUser = {
    id: foundUser._id,
    username: foundUser.username
  }
  
  return res.redirect("/");

  } catch(err) {
    console.log(err);
    res.send(err);
  }
});
```

10. Create middleware for user credentials. 

server.js 

```js
/* ==== Middleware ==== */
//...

// add user credientials to ejs files
app.use(function(req,res,next){
	app.locals.user = req.session.currentUser;
	next();
});

// authRequired middleware for gate keeping
const authRequired = function(req,res,next){
	if(req.session.currentUser){
		return next();
	}

	return res.redirect("/login");
};
```

11. Use the Auth Required Middleware for gate keeping other routes. 

server.js
```js
/* ==== Routes/Controllers ==== */
//...

// author controller
app.use("/authors", authRequired, controllers.authors);

// article controller
app.use("/articles", authRequired, controllers.articles);
```

12. Add a Delete route for Logout 

controllers/auth.js

```js 
router.delete("/logout", async function(req,res){
  await req.session.destroy();
  return res.redirect("/");
});
```