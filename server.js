/************************************************************************************
 * WEB322 – Project (Fall 2021)
 * I declare that this assignment is my own work in accordance with Seneca Academic
 * Policy. No part of this assignment has been copied manually or electronically from
 * any other source (including web sites) or distributed to other students.
 *
 * Name: JATIN HANS
 * Student ID: 141560201
 * Course/Section: ZAA
 *
 ************************************************************************************/

const path = require("path");

const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require('body-parser');

const dotenv = require('dotenv');
dotenv.config({path:"./config/keys.env"});
const app = express();
// Set up body parser
app.use(bodyParser.urlencoded({ extended: false }));
///////////////////////
app.engine(
  ".hbs",
  exphbs({
    extname: ".hbs",
    defaultLayout: "main",
  })
);

app.set("view engine", ".hbs");
var meals = [
  {
    name: "Sticky Pecan Chicken Breasts",
    topping: "with Napa Cabbage, Bok Choy Tips",
    availability: "Family Basket",
    img: "/images/4.jpg",
    visible: true,
    category: "Classic Meals",
    price: "19.99",
    time: "25 minutes",
    servings: "2",
    per_serving: "240",
    top_meal: true,
  },
  {
    name: "Tamarind Beef Meatball Bread",
    topping: "with Sweet Peppers & Leafy Greens",
    availability: "Easy Prep Basket",
    img: "/images/5.jpg",
    visible: true,
    category: "Classic Meals",
    price: "19.99",
    time: "25 minutes",
    servings: "2",
    per_serving: "240",
    top_meal: true,
  },
  {
    name: "Tex-Mex Style Naan Pizza",
    topping: "Freash Tomato & Cilantro Salsa",
    availability: "Family Basket",
    img: "/images/6.jpg",
    visible: true,
    category: "Classic Meals",
    price: "19.99",
    time: "25 minutes",
    servings: "2",
    per_serving: "240",
    top_meal: true,
  },
  {
    name: "Chicken Mushroom & Broccoli Bake",
    topping: "with Cavatappi& Roasted Broccoli",
    availability: "Easy Prep Basket",
    img: "/images/7.jpg",
    visible: true,
    category: "Classic Meals",
    price: "19.99",
    time: "25 minutes",
    servings: "2",
    per_serving: "240",
    top_meal: true,
  },

  {
    name: "Pancetta and Egg Raman Noodles",
    topping: "Chilli Tomato & Peas",
    availability: "Family Basket",
    img: "/images/8.jpg",
    visible: true,
    category: "Chinese Meals",
    price: "19.99",
    time: "25 minutes",
    servings: "2",
    per_serving: "240",
    top_meal: true,
  },
  {
    name: "Ground Beef & Zucchini Taquitios",
    topping: "with Cucumber-Tomato Salsa",
    availability: "Easy Prep Basket",
    img: "/images/9.jpg",
    visible: true,
    category: "Chinese Meals",
    price: "19.99",
    time: "25 minutes",
    servings: "2",
    per_serving: "240",
    top_meal: true,
  },
  {
    name: "Pork Sausage & Squash Cavetli",
    topping: "with Sausage and Squash cavetli",
    availability: "Family Basket",
    img: "/images/10.jpg",
    visible: true,
    category: "Chinese Meals",
    price: "19.99",
    time: "25 minutes",
    servings: "2",
    per_serving: "240",
    top_meal: true,
  },
  {
    name: "Tandoori Squash Naan Pizza",
    topping: "Lettuce & Reedish Creamy bDressing",
    availability: "Easy Prep Basket",
    img: "/images/11.jpg",
    visible: true,
    category: "Chinese Meals",
    price: "19.99",
    time: "25 minutes",
    servings: "2",
    per_serving: "240",
    top_meal: true,
  },
];
// setup a 'route' to listen on the default url path (http://localhost)
app.get("/", function (req, res) {
  var arr = [];
  for (let i = 0; i < 4; i++) {
    arr.push(meals[i]);
  }
  res.render("home", {
    arr,
  });
});

// setup another route to listen on /about
app.get("/onthemenu", function (req, res) {
  const groupBy = (array, key) => {
    return array.reduce((result, currentValue) => {
      (result[currentValue[key]] = result[currentValue[key]] || []).push(
        currentValue
      );
      return result;
    }, {});

  };
  const ObjArray = [];
  const personGroupedByColor = groupBy(meals, "category");

  Object.keys(personGroupedByColor).forEach((key) =>
    ObjArray.push({
      meal: key,
      prop: personGroupedByColor[key],
    })
  );
  res.render("onthemenu.hbs", {
    ObjArray
  });
});

///////////////////////

// Setup a folder that contains static resources.
app.use(express.static("static"));

// Set up a route to our homepage (default route).
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/index.html"));
});

app.get("/menu", (req, res) => {
  res.send("<a href='/'>Plaese go to Main page</a>");
});

app.get("/home", (req, res) => {
  res.render("home");
});

app.get("/Sign-in", (req, res) => {
  res.render("Sign-in");
});

app.get("/welcome", (req, res) => {
  res.render("welcome");
});

app.get("/Registration", (req, res) => {
  res.render("Registration");
});

app.get("/extra", (req, res) => {
  res.send("<a href='/'>Plaese go to Main page</a>");
});
// Set up another route that sends back an object (not string).
app.get("/headers", (req, res) => {
  const headers = req.headers;
  res.send(headers);
});

// Configure my controllers.
const generalController = require("./controllers/general");
app.use("/", generalController);

// Configure my controllers.
const generalController1 = require("./controllers/general1");
app.use("/", generalController1);

// *** THE FOLLOWING CODE SHOULD APPEAR IN YOUR ASSIGNMENT AS IS (WITHOUT MODIFICATION) ***

// This use() will not allow requests to go beyond it
// so we place it at the end of the file, after the other routes.
// This function will catch all other requests that don't match
// any other route handlers declared before it.
// This means we can use it as a sort of 'catch all' when no route match is found.
// We use this function to handle 404 requests to pages that are not found.
app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

// This use() will add an error handler function to
// catch all errors.
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Define a port to listen to requests on.
const HTTP_PORT = process.env.PORT || 8080;

// Call this function after the http server starts listening for requests.
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

// Listen on port 8080. The default port for http is 80, https is 443. We use 8080 here
// because sometimes port 80 is in use by other applications on the machine
app.listen(HTTP_PORT, onHttpStart);
