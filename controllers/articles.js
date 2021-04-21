// require
const express = require("express");
const router = express.Router();

const db = require("../models");

// base route is /articles

// Rest Routes
/*
 * Index - GET - /articles  - Presentational - respond with all articles
 * New - GET - /articles/new  - Presentational Form - a page with a form to create a new article
 * Show - GET - /articles/:id  - Presentational - respond with specific article by id
 * Create - Post - /articles  - Functional - recieve data from new route to create a article
 * Edit - GET - /articles/:id/edit  - Presentational Form - respond with a form prefilled with article data
 * Update - PUT - /articles/:id  - Functional - recieve data from edit to update a specific article
 * Delete - DELETE - /articles/:id  - Functional - Deletes article by id from request
 */

// Index
router.get("/", function (req, res) {
	db.Article.find({}, function (err, foundArticles) {
		if (err) return res.send(err);

		const context = { articles: foundArticles };
		res.render("articles/index", context);
	});
});

// New
router.get("/new", function (req, res) {
	db.Author.find({}, function (err, foundAuthors) {
		if (err) return res.send(err);

		const context = { authors: foundAuthors };
		res.render("articles/new", context);
	});
});

// router.get("/new", function (req, res) {
// 	res.render("articles/new");
// });

// Show
router.get("/:id", function (req, res) {
	db.Article.findById(req.params.id)
		//
		.populate("author") // db.Author.findById()
		.exec(function (err, foundArticle) {
			if (err) return res.send(err);

			const context = { article: foundArticle };
			res.render("articles/show", context);
		});
});

// Create
router.post("/", function (req, res) {
	db.Article.create(req.body, function (err, createdArticle) {
		if (err) return res.send(err);

		// allows us to add an article to the author
		//.exec short for execute. used to help stack functions. similar to .then. after this query, exectute this one!
		db.Author.findById(createdArticle.author).exec(function (err, foundAuthor) {
			if (err) return res.send(err);

			// update the author articles array
			foundAuthor.articles.push(createdArticle); // adds article to the author
			foundAuthor.save(); // save relationship to database, commits to memory

			return res.redirect("/articles");
		});
	});
});

// Edit
router.get("/:id/edit", function (req, res) {
	db.Article.findById(req.params.id, function (err, foundArticle) {
		if (err) return res.send(err);

		const context = { article: foundArticle };
		res.render("articles/edit", context);
	});
});

// Update
router.put("/:id", function (req, res) {
	db.Article.findByIdAndUpdate(
		// id to find
		req.params.id,
		// data to update
		{
			$set: {
				// title: req.body
				// body: req.body
				...req.body,
			},
		},
		// return the new object
		{ new: true },
		// callback function after the update has completed
		function (err, updatedArticle) {
			if (err) return res.send(err);
			return res.redirect(`/articles/${updatedArticle._id}`);
		}
	);
});

// Delete
router.delete("/:id", function (req, res) {
	db.Article.findByIdAndDelete(req.params.id, function (err, deletedArticle) {
		if (err) return res.send(err);

		// we find the author, take the author, remove the article from the author so that we remove the ID that we put into the array from memory.

		db.Author.findById(deletedArticle.author, function (err, foundAuthor) {
			foundAuthor.articles.remove(deletedArticle);
			foundAuthor.save();

			return res.redirect("/articles");
		});
	});
});

module.exports = router;
