const mongoose = require("mongoose");

// set up schema for validation
// example articles: ["ayches976729djsl"]
const authorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "You must provide a name property"],
    },
    articles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Article" }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

// then we create the model with the schema for use in the rest of our application
const Author = mongoose.model("Author", authorSchema);

// export model
module.exports = Author;
