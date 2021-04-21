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
	// .populate populates show page with all articles on show page for authors. the string it takes in is the key that we're populating from the schema (not the model)
	db.Author.findById(req.params.id)
		.populate("articles")
		.exec(function (err, foundAuthor) {
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

// Edit
// presentational form
router.get("/:id/edit", function (req, res) {
	db.Author.findById(req.params.id, function (err, foundAuthor) {
		if (err) res.send(err);

		const context = { author: foundAuthor };
		return res.render("authors/edit", context);
	});
});

// Update
// logic to PUT/REPLACE data in the database
router.put("/:id", function (req, res) {
	db.Author.findByIdAndUpdate(
		// id to find
		req.params.id,
		// data to update
		{
			$set: {
				// name: req.body.name
				// additional key:value pairs from model
				...req.body,
			},
		},
		// return the new database object
		{ new: true },
		// callback function upon completion
		function (err, updatedAuthor) {
			if (err) return res.send(err);
			return res.redirect(`/authors/${updatedAuthor._id}`);
		}
	);
});

// Delete
// this is a cascade delete, finding all authors by the same author and deleting them, because we're deleting the author. this is essentially about database memory and storage, deleting all associated resources. since the author is the one in the one to many, we have to delete the many when we delete the one.
router.delete("/:id", function (req, res) {
	db.Author.findByIdAndDelete(req.params.id, function (err, deletedAuthor) {
		if (err) return res.send(err);

		db.Article.deleteMany(
			{ author: deletedAuthor._id },
			function (err, deletedArticles) {
				if (err) return res.send(err);
				return res.redirect("/authors");
			}
		);
	});
});

module.exports = router;
