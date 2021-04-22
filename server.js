/* ==== External Modules ==== */
const express = require("express");
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require("connect-mongo");

/* ==== Internal Modules ==== */
const controllers = require("./controllers");

/* ==== Instanced Modules ==== */
const app = express();

/* ==== Configuration ==== */
const PORT = 4000;

app.set("view engine", "ejs");

/* ==== Middleware ==== */

// body data middleware
app.use(express.urlencoded({ extended: true }));
// method override middleware
app.use(methodOverride("_method"));
// middleware to serve public as static files
app.use(express.static(__dirname + "/public"));

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

// logger middleware
// all controller functions take in req,res,next
app.use(function(req,res,next){
	console.log(`${req.method} - ${req.url}`);
	console.log(req.session);
	// we use next in routes to tell express to move on to the next route in order
	next();
});

/* ==== Routes/Controllers ==== */

// Home routes
app.get("/", function (req, res) {
	res.render("home");
});

// authentication and authorization
app.use("/", controllers.auth);

// author controller
app.use("/authors", controllers.authors);

// article controller
app.use("/articles", controllers.articles);

/* ==== Server Listener ==== */
app.listen(PORT, function () {
	console.log(`Blog application is live at http://localhost:${PORT}/`);
});
