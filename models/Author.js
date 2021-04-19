const mongoose = require("mongoose");

// set up schema for validation
const authorSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "You must provide a name property"],
		},
	},
	{
		timestamps: true,
	}
);

// then we create the model with the schema for use in the rest of our application
const Author = mongoose.model("Author", authorSchema);

// export model
module.exports = Author;
