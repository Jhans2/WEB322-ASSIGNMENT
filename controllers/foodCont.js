const userModel = require("../models/food");
const path = require("path");
const express = require("express");
const router = express.Router();

router.post("/deleteDash", (req, res) => {
  userModel
    .deleteOne({
      _id: req.body.id,
    })
    .exec()
    .then(() => {
      console.log("Successfully remove the meal for " + req.body.Name);
      res.redirect("/deleteDash");
    });
});

function get_extension(filename) {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
}

router.post("/updateName", (req, res) => {
  console.log(req.body);
  let validation = {};
  userModel
    .updateOne(
      {
        _id: req.body.id,
      },
      {
        $set: {
          name: req.body.name,
          topping: req.body.topping,
          description: req.body.description,
          category: req.body.category,
          price: req.body.price,
          time: req.body.time,
          servings: req.body.servings,
          per_serving: req.body.per_serving,
          top_meal: req.body.top_meal,
        },
      }
    )
    .exec()
    .then(() => {
      if (req.files && req.files.profilePic && req.files.profilePic.name) {
        var ext = get_extension(req.files.profilePic.name);
        if (ext == "jpg" || ext == "png" || ext == "gif") {
          let uniqueName = `profile-pic-${req.body.id}${
            path.parse(req.files.profilePic.name).ext
          }`;
          req.files.profilePic.mv(`static/images/${uniqueName}`).then(() => {
            uniqueName = `/images/${uniqueName}`;
            userModel
              .updateOne(
                {
                  _id: req.body.id,
                },
                {
                  img: uniqueName,
                }
              )
              .then(() => {
                console.log("User document was updated with the meal picture.");
              })
              .catch((err) => {
                console.log(`Error updating the meal picture ... ${err}`);
              });
          });
          console.log("Successfully updated the meal");
          res.redirect("/showMeals");
        } else {
          userModel
            .findById(req.body.id)
            .exec()
            .then((meal) => {
              if (!meal) {
                console.log("Error finding meal");
              } else {
                let editMeal = {
                  _id: meal._id,
                  name: meal.name,
                  topping: meal.topping,
                  description: meal.description,
                  img: meal.img,
                  category: meal.category,
                  price: meal.price,
                  time: meal.time,
                  servings: meal.servings,
                  per_serving: meal.per_serving,
                  top_meal: meal.top_meal,
                };
                validation.ext =
                  "Please only put the image with extesnion .jpg,.png or .gif";
                res.render("updateMeal", {
                  meal: editMeal,
                  validation,
                });
              }
            });
        }
      } else {
        res.redirect("/showMeals");
      }
    })
    .catch((err) => {
      console.log(`Error updating the meal ... ${err}`);
    });
});

router.post("/addMeal", (req, res) => {
  const { Name, tName, des, type, price, time, tServings, pServings, top } =
    req.body;
  let passed = true;
  let validation = {};
  if (Name.trim().length === 0) {
    passed = false;
    validation.Name = "You must specify a meal name.";
  }
  if (tName.trim().length === 0) {
    passed = false;
    validation.tName = "You must specify topping name.";
  }
  if (des.trim().length === 0) {
    passed = false;
    validation.des = "You must give meal description.";
  }
  if (type.trim().length === 0) {
    passed = false;
    validation.type = "You must specify a meal type.";
  }
  if (price.trim().length === 0) {
    passed = false;
    validation.price = "You must specify the meal price.";
  }
  if (time.trim().length === 0) {
    passed = false;
    validation.time = "You must specify the meal cooking time.";
  }
  if (tServings.trim().length === 0) {
    passed = false;
    validation.tServings = "You must specify the meal total servings.";
  }
  if (pServings.trim().length === 0) {
    passed = false;
    validation.pServings = "You must specify the meal per serving.";
  }
  if (top.trim().length === 0) {
    passed = false;
    validation.top = "You must specify is the meal top meal or not.";
  }
  var ext = get_extension(req.files.profilePic.name);
  if (
    ext.trim().length === 0 ||
    !(ext === "jpg" || ext === "gif" || ext === "png")
  ) {
    passed = false;
    validation.ext =
      "Please only put the image with extesnion .jpg,.png or .gif";
  }

  if (passed) {
    let user = new userModel({
      name: req.body.Name,
      topping: req.body.tName,
      description: req.body.des,
      category: req.body.type,
      price: req.body.price,
      time: req.body.time,
      servings: req.body.tServings,
      per_serving: req.body.pServings,
      top_meal: req.body.top,
    });

    user
      .save()
      .then((userSaved) => {
        console.log(`User ${userSaved.name} has been added to the database.`);

        let uniqueName = `profile-pic-${userSaved._id}${
          path.parse(req.files.profilePic.name).ext
        }`;

        req.files.profilePic.mv(`static/images/${uniqueName}`).then(() => {
          uniqueName = `/images/${uniqueName}`;
          userModel
            .updateOne(
              {
                _id: userSaved._id,
              },
              {
                img: uniqueName,
              }
            )
            .then(() => {
              console.log("User document was updated with the meal picture.");
              res.redirect("/clerkDash");
            })
            .catch((err) => {
              console.log(`Error updating the meal picture ... ${err}`);
              res.redirect("/addMeal");
            });
        });
      })
      .catch((err) => {
        console.log(`Error adding meal to the database ... ${err}`);
        res.redirect("/addMeal");
      });
  } else {
    res.render("addMeal", {
      values: req.body,
      validation,
    });
  }
});

router.get("/load-data/meal-kits", (req, res) => {
  var errors = {};
  if (req.session && req.session.user && req.session.clerk) {
    userModel.find().count({}, (err, count) => {
      if (err) {
        res.send("Couldn't find: " + err);
      } else if (count === 0) {
        var meals = [
          {
            name: "Sticky Pecan Chicken Breasts",
            topping: "with Napa Cabbage, Bok Choy Tips",
            description: "Family Basket",
            img: "/images/4.jpg",
            category: "Classic Meals",
            price: "19.99",
            time: "25",
            servings: "2",
            per_serving: "240",
            top_meal: true,
          },
          {
            name: "Tamarind Beef Meatball Bread",
            topping: "with Sweet Peppers & Leafy Greens",
            description: "Easy Prep Basket",
            img: "/images/5.jpg",
            category: "Classic Meals",
            price: "19.99",
            time: "25",
            servings: "2",
            per_serving: "240",
            top_meal: true,
          },
          {
            name: "Tex-Mex Style Naan Pizza",
            topping: "Freash Tomato & Cilantro Salsa",
            description: "Family Basket",
            img: "/images/6.jpg",
            category: "Classic Meals",
            price: "19.99",
            time: "25",
            servings: "2",
            per_serving: "240",
            top_meal: true,
          },
          {
            name: "Chicken Mushroom & Broccoli Bake",
            topping: "with Cavatappi& Roasted Broccoli",
            description: "Easy Prep Basket",
            img: "/images/7.jpg",
            category: "Classic Meals",
            price: "19.99",
            time: "25",
            servings: "2",
            per_serving: "240",
            top_meal: false,
          },

          {
            name: "Pancetta and Egg Raman Noodles",
            topping: "Chilli Tomato & Peas",
            description: "Family Basket",
            img: "/images/8.jpg",
            category: "Chinese Meals",
            price: "19.99",
            time: "25",
            servings: "2",
            per_serving: "240",
            top_meal: false,
          },
          {
            name: "Ground Beef & Zucchini Taquitios",
            topping: "with Cucumber-Tomato Salsa",
            description: "Easy Prep Basket",
            img: "/images/9.jpg",
            category: "Chinese Meals",
            price: "19.99",
            time: "25",
            servings: "2",
            per_serving: "240",
            top_meal: false,
          },
          {
            name: "Pork Sausage & Squash Cavetli",
            topping: "with Sausage and Squash cavetli",
            description: "Family Basket",
            img: "/images/10.jpg",
            category: "Chinese Meals",
            price: "19.99",
            time: "25",
            servings: "2",
            per_serving: "240",
            top_meal: false,
          },
          {
            name: "Tandoori Squash Naan Pizza",
            topping: "Lettuce & Reedish Creamy bDressing",
            description: "Easy Prep Basket",
            img: "/images/11.jpg",
            category: "Chinese Meals",
            price: "19.99",
            time: "25",
            servings: "2",
            per_serving: "240",
            top_meal: false,
          },
        ];

        userModel.collection.insertMany(meals, (err, docs) => {
          if (err) {
            errors.message = "Couldn't insert: " + err;
            res.render("loadErr", {
              errors,
            });
          } else {
            errors.message = "Added meal kits to the database";
            res.render("loadErr", {
              errors,
            });
          }
        });
      } else {
        errors.message = "Meal kits have already been added to the database";
        res.render("loadErr", {
          errors,
        });
      }
    });
  } else {
    errors.message = "You are not authorized to add meal kits";
    res.render("loadErr", {
      errors,
    });
  }
});

router.get("/edit/:_id", (req, res) => {
  userModel
    .findById(req.params._id)
    .exec()
    .then((meal) => {
      if (!meal) {
        console.log("Error finding meal");
      } else {
        let editMeal = {
          _id: meal._id,
          name: meal.name,
          topping: meal.topping,
          description: meal.description,
          img: meal.img,
          category: meal.category,
          price: meal.price,
          time: meal.time,
          servings: meal.servings,
          per_serving: meal.per_serving,
          top_meal: meal.top_meal,
        };
        res.render("updateMeal", {
          meal: editMeal,
        });
      }
    });
});

module.exports = router;
