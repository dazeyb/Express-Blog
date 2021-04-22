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