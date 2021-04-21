// // // // NOTE TO APRIL : make a branch 'ejs-partials' and submit a pull request to the express-blog repo. Once the pull request has been accepted, then the students can `git pull` to get my branch, which will be empty except for the PLAN.js

// // Steps for creating and using EJS Partials

// Checkout to a new git branch to mess around in our code worry-free!
/** `git checkout ejs-partials` */

// Create 'partials' directory in 'views' to hold the files we'll make
// How Do I Know? Documentation ==> here https://ejs.co/ 'Options' section tells us to use 'views' with 'include', and 'include' is shown in the 'Layouts' section
// // But How Do I Really Know? Cause someone showed me ==> share the things you learn to grow your community
/** `mkdir views/partials` */

// Create a 'header' and 'footer' file so we can put all the repeating html in one place, and 'include' where we need to
/** `touch views/partials/header.js views/partials/footer.ejs` */

// Open any of your ejs files to grab the html we will use
// <command+p> search: home

// in home.ejs
// <command+a> select the text from '!Document' to '</nav>'
// <command+x> cuts the text from the doc - it doesn't need to be there anymore
// <command+p> search: header

// in header.ejs
// <command+v> pastes the text from 'home.ejs' 
`<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<link rel="stylesheet" href="/styles/main.css" />
		<link rel="scripts" href="/scripts/app.js" />
		<title>Blog App</title>
	</head>
	<body>
		<nav>
			<h1>Welcome to Blog App!</h1>
			<ul>
				<li>
					<a href="/authors">Authors</a>
				</li>
				<li>
					<a href="/articles">Articles</a>
				</li>
			</ul>
		</nav>`

// <command+s> save the file
// <control+tab> create dropdown of open files, hold control and tab tab till home.ejs is highlighted

// in home.ejs
// use the stingray ` <%- ` to 'include' other files
`<%- include("header"); -%>
</body>
</html>`

// let's spin up the server and check if it's working by changing the css in a page
// use the custom command we have created in our package.json file
/** `npm run dev` */

// // // // // // Reorganization thought \\
// instead of including a header and footer, could I 'include' the index & show pages in the home.ejs??
// but I have one plan so I'm gonna see this through and finish what I started
// BUT I think it's a good idea and wrote it down in the project so I can work on it in future iterations
// AND WE'RE BACK \\ \\ \\ \\ \\ \\

// it's throwing an error: Could not find the include file "header"
// okay so the problem is it can't find anything by the name I'm calling => debugging time
// here's what I tried:
`<%- include("header.ejs"); -%>` // throwing: Could not find the include file "header.ejs"
`<%- include("/header"); -%>` // throwing: ENOENT: no such file or directory, open '/header.ejs'
`<%- include("partials/header"); -%>` // All the pages have a white background, so it doesn't break but it doesn't work
`<%- include("/partials/header"); -%>` // throwing: ENOENT: no such file or directory, open '/partials/header.ejs'
`<%- include("../partials/header"); -%>` //Could not find the include file "../partials/header"
`<%- include("./partials/header"); -%>` // All the pages have a white background, so it doesn't break but it doesn't work
`<%- include("./partials/header.ejs"); -%>` // ''
`<%- include("../partials/header.ejs"); -%>` // throwing: Could not find the include file "../partials/header.ejs"
`<%- include("partials/header.ejs"); -%>` // All the pages have a white background, so it doesn't break but it doesn't work
// // That's every iteration I can think of, and I referenced a past project

// Go back to stare at header.ejs
// realize it doesn't have a link to the css file
// feel like a genius

// in header.ejs
`<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="../../public/styles/main.css" rel="stylesheet" />
		<title>Blog | Articles</title>
	</head>
	<body>
		<nav>
			<h1>Welcome to Blog App</h1>
			<ul>
				<li>
					<a href="/authors">Authors</a>
				</li>
				<li>
					<a href="/articles">Articles</a>
				</li>
				<li>
					<a href="/articles/new">Add an Article</a>
				</li>
			</ul>
		</nav>
		<main>`

// nothing has changed
// feel like a turd
// realize it's way past the time I wanted to go to sleep (10pm MST) and call it quits for the night =>
// I will be better for taking a break

// // I LOVE THE SMELL OF BUGS IN THE MORNING

// problem where I left it: I wrote an ejs partial for the header, and have 'included' it in home.ejs, but since I'm not seeing any css changes I'm assuming it's not working
// time to research
// search: `ejs partial Could not find the include file`

// read https://www.codegrepper.com/code-examples/javascript/why+ejs+include+partials%2Fheader.ejs+not+working
// try: 
`<%- include("partials/header.ejs") %>` // no change
`<%- include '../partials/header.ejs' %>` // no change

// reference old project
// change relative path to css file

// in header.ejs
`<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="/styles/main.css" rel="stylesheet" />
		<title>Blog | Articles</title>
	</head>
	<body>
		<nav>
			<h1>Welcome to Blog App</h1>
			<ul>
				<li>
					<a href="/authors">Authors</a>
				</li>
				<li>
					<a href="/articles">Articles</a>
				</li>
				<li>
					<a href="/articles/new">Add an Article</a>
				</li>
			</ul>
		</nav>
		<main>`

`<%- include("../partials/header.ejs") %>` // Could not find the include file "../partials/header.ejs"
`<%- include("/partials/header.ejs") %>` //ENOENT: no such file or directory, open '/partials/header.ejs'
`<%- include("partials/header.ejs") %>` //OHJMYGOD ITWORKED !!!!!!!! ??????????????? !!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// try to duplicate my success

// in articles/index.ejs
`<%- include("partials/header.ejs") %>
<h2>List of articles</h2>

<% if(!articles.length) { %>
<p>There are no articles available yet.</p>
<% } %>

<ul>
	<% articles.forEach(article => { %>
	<li>
		<a href="/articles/<%= article._id %>"> <%= article.title %></a>
	</li>
	<% })%>
</ul>
</main>
</body>
</html>`
// throwing: Could not find the include file "partials/header.ejs"
// since it just worked at home, but not for the articles dir, maybe the problem is the relative path

`<%- include("./partials/header.ejs") %>` // Could not find the include file "./partials/header.ejs"
`<%- include("../partials/header.ejs") %>` // ITWORKED!!!!!!!!!!!!!!!!!!
// seems like my theory about relative pathing was right

// add `<%- include("../partials/header.ejs") %>` to show and index pages, haven't done it yet for the new or edit yet

// now when I change css, it'll change in all those files!

// in main.css
`* {
	box-sizing: border-box;
}

body {
	margin: 0;
	padding: 0;
	background-color: #dcdadaf1;
}`