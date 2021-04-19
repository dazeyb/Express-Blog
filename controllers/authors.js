// require express
const express = require("express");
// set up router
const router = express.Router();
// internal modules (database)
const db = require("../models");

// base routes (authors)
// Rest Routes
/*
 * Index - GET - /authors  - Presentational - respond with all authors
 * New - GET - /authors/new  - Presentational Form - a page with a form to create a new author
 * Show - GET - /authors/:id  - Presentational - respond with specific author by id
 * Create - Post - /authors  - Functional - recieve data from new route to create a author
 * Edit - GET - /authors/:id/edit  - Presentational Form - respond with a form prefilled with author data
 * Update - PUT - /authors/:id  - Functional - recieve data from edit to update a specific author
 * Delete - DELETE - /authors/:id  - Functional - Deletes author by id from request
 */

// Index
router.get("/", function (req, res) {
	// mongoose
	db.Author.find({}, function (err, allAuthors) {
		if (err) return res.send(err);

		const context = { authors: allAuthors };
		return res.render("authors/index", context);
	});
});

// New
router.get("/new", function (req, res) {
	res.render("authors/new");
});

// Show
router.get("/:id", function (req, res) {
	db.Author.findById(req.params.id, function (err, foundAuthor) {
		if (err) return res.send(err);

		const context = { author: foundAuthor };
		return res.render("authors/show", context);
	});
});

// Create
router.post("/", function (req, res) {
	db.Author.create(req.body, function (err, createdAuthor) {
		if (err) return res.send(err);

		return res.redirect("/authors");
	});
});

module.exports = router;
