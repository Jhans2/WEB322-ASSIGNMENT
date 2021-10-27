const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("/home", {
    // title: "Home Page"
  });
});

router.get("/Sign-in", (req, res) => {
  res.render("Sign-in", {
    // title: "Contact Us Page",
  });
});

router.post("/Sign-in", (req, res) => {
  console.log(req.body);

  const { email, password } = req.body;

  let passed = true;
  let validation = {};

  if (email.trim().length === 0) {
    passed = false;
    validation.email = "Please enter a valid E-mail address";
  } 

  if (password.trim().length === 0) {
    passed = false;
    validation.password = "Please enter your password";
  } 

  if (passed) {
    res.send("You logged in successfully!!!!");
  } else {
    res.render("Sign-in", {
      //   title: "Contact Us Page",
      values: req.body,
      validation,
    });
  }
});

module.exports = router;
