const db = require("../models");

const authors = [
  { name: "Hemmingway" },
  { name: "William Gibson" },
  { name: "George RR Martin" },
  { name: "Terr Mckenna" },
];

const articles = [
  {
    title: "Super Cool Article",
    body: "Lorem ipsum stuffs",
    author: "Hemmingway",
  },
  {
    title: "Even Cooler Article",
    body: "Lorem ipsum stuffs",
    author: "William Gibson",
  },
];

const run = async () => {
  try {
    await db.Author.deleteMany({}); // remove all authors
    await db.Article.deleteMany({});
    const createdAuthors = await db.Author.insertMany(authors);

    for (article of articles) {
      const foundAuthor = await db.Author.findOne({ name: article.author });
      article.author = foundAuthor;
      const createdArticle = await db.Article.create(article);
      foundAuthor.articles.push(createdArticle);
      foundAuthor.save();
    }
    console.log("Seed Finished.");
    process.exit(); // this will exit the file when this line is hit
  } catch (err) {
    console.log(err);
    process.exit();
  }
};

run();
