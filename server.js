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
const userModel = require("./models/food");
const path = require("path");
const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/keys.env" });
const mongoose = require("mongoose");

const app = express();

// Set up body parser
app.use(bodyParser.urlencoded({ extended: false }));

// Set up express-fileupload
app.use(fileUpload());

///////////////////////
app.engine(
  ".hbs",
  exphbs({
    extname: ".hbs",
    defaultLayout: "main",
  })
);

app.set("view engine", ".hbs");
// Set up express-session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use((req, res, next) => {
  // res.locals.user is a global handlebars variable.
  // This means that every single handlebars file can access this variable.
  res.locals.user = req.session.user;
  res.locals.clerk = req.session.clerk;
  res.locals.cart = req.session.cart;
  next();
});

app.get("/", (req, res) => {
  let arr = [];
  userModel.find({ top_meal: "true" }).then((meals) => {
    arr = meals.map((meal) => {
      return {
        name: meal.name,
        topping: meal.topping,
        img: meal.img,
        description: meal.description,
      };
    });
    res.render("home", {
      arr,
    });
  });
});

app.get("/customerDash", (req, res) => {
  let arr = [];
  userModel.find({ top_meal: "true" }).then((meals) => {
    arr = meals.map((meal) => {
      return {
        name: meal.name,
        topping: meal.topping,
        img: meal.img,
        description: meal.description,
      };
    });
    res.render("customerDash", {
      arr,
    });
  });
});

app.get("/updateDash", function (req, res) {
  userModel
    .find()
    .exec()
    .then((data) => {
      data = data.map((value) => value.toObject());
      var meals = data;
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
      res.render("updateDash.hbs", {
        ObjArray,
      });
    });
});

app.get("/deleteDash", function (req, res) {
  userModel
    .find()
    .exec()
    .then((data) => {
      data = data.map((value) => value.toObject());
      var meals = data;
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
      res.render("deleteDash.hbs", {
        ObjArray,
      });
    });
});

// setup another route to listen on /about
app.get("/showMeals", function (req, res) {
  userModel
    .find()
    .exec()
    .then((data) => {
      // Pull the data (exclusively)
      // This is to ensure that our "data" object contains the returned data (only) and nothing else.
      data = data.map((value) => value.toObject());
      var meals = data;
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
      res.render("showMeals.hbs", {
        ObjArray,
      });
    });
});

app.get("/clerkDash", (req, res) => {
  res.render("clerkDash");
});

app.get("/error", (req, res) => {
  res.render("error");
});


app.get("/confirmedOrder", (req, res) => {
  res.render("confirmedorder");
});

app.get("/shoppingCart", (req, res) => {
  res.render("shoppingCart");
});

app.get("/updateMeal", (req, res) => {
  res.render("updateMeal");
});

// setup another route to listen on /about
app.get("/onthemenu", function (req, res) {
  userModel
    .find()
    .exec()
    .then((data) => {
      // Pull the data (exclusively)
      // This is to ensure that our "data" object contains the returned data (only) and nothing else.
      data = data.map((value) => value.toObject());
      var meals = data;
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
        ObjArray,
      });
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

app.get("/loadErr", (req, res) => {
  res.render("loadErr");
});

app.get("/Registration", (req, res) => {
  res.render("Registration");
});

app.get("/addMeal", (req, res) => {
  res.render("addMeal");
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
const generalController1 = require("./controllers/user");
app.use("/", generalController1);

// Configure my controllers.
const generalController2 = require("./controllers/foodCont");
app.use("/", generalController2);

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

// Assignment4
// Set up and connect to MongoDB
mongoose
  .connect(process.env.MONGO_DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the MongoDB database.");
  })
  .catch((err) => {
    console.log(`There was a problem connecting to MongoDB ... ${err}`);
  });
//end of Assignment 4

// Define a port to listen to requests on.
const HTTP_PORT = process.env.PORT || 8080;

// Call this function after the http server starts listening for requests.
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

// Listen on port 8080. The default port for http is 80, https is 443. We use 8080 here
// because sometimes port 80 is in use by other applications on the machine
app.listen(HTTP_PORT, onHttpStart);
