// require
const mongoose = require("mongoose");

// schema
const articleSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		body: { type: String, required: true },
		author: { type: mongoose.Schema.Types.ObjectId, ref: "Author" },
	},
	{
		timestamps: true,
	}
);

// model
const Article = mongoose.model("Article", articleSchema);

// export
module.exports = Article;
