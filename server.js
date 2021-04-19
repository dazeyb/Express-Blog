/* ==== External Modules ==== */
const express = require("express");
const methodOverride = require("method-override");

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

/* ==== Routes/Controllers ==== */

// Home routes
app.get("/", function (req, res) {
	res.render("home");
});

// author controller
app.use("/authors", controllers.authors);

// article controller
app.use("/articles", controllers.articles);

/* ==== Server Listener ==== */
app.listen(PORT, function () {
	console.log(`Blog application is live at http://localhost:${PORT}/`);
});
