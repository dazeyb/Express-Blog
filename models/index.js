// require mongoose
const mongoose = require("mongoose");

// connect to mongodb
const dbUrl = "mongodb://localhost:27017/blogdb";
// here i am naming the database blogdb and creating it

// connect mongoose
mongoose
	.connect(dbUrl, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false,
	})
	.then(function () {
		console.log("MongoDB connected! :)");
	})
	.catch(function (err) {
		console.log("MongoDB error :(");
		console.log(err);
	});

mongoose.connection.on("disconnected", function () {
	console.log("MongoDB disconnected :(");
});

// this code functions exactly the same as:

/* mongoose.connection.on("connected"), function(){
    console.log("mongodb connected");
});

mongoose.connection.on("disconnected"), function(){
    console.log("mongodb disconnected");
});

mongoose.connection.on("error"), function(error){
    console.log("mongodb error");
});

*/

module.exports = {
	Author: require("./Author"),
	Article: require("./Article"),
};
