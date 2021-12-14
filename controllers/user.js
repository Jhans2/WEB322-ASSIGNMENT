const userModel = require("../models/user");
const bcrypt = require("bcryptjs");
const path = require("path");
const express = require("express");
const router = express.Router();

router.get("/Registration", (req, res) => {
  res.render("Registration", {});
});

router.post("/Registration", (req, res) => {
  console.log(req.body);

  const { firstName, lastName, email, password } = req.body;

  let passed = true;
  let validation = {};
  const regEx =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  var strongRegex = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{6,12})"
  );

  var Regex1 = new RegExp("(?=.*[A-Z])");
  var Regex2 = new RegExp("(?=.*[a-z])");
  var Regex3 = new RegExp("(?=.*[0-9])");
  var Regex4 = new RegExp("(?=.*[!@#$%^&*])");

  if (typeof firstName !== "string" || firstName.trim().length === 0) {
    passed = false;
    validation.firstName = "You must specify a first name.";
  } else if (typeof firstName !== "string" || firstName.trim().length < 2) {
    passed = false;
    validation.firstName = "First name should be at least 2 characters long.";
  }

  if (typeof lastName !== "string" || lastName.trim().length === 0) {
    passed = false;
    validation.lastName = "You must specify a last name.";
  } else if (typeof lastName !== "string" || lastName.trim().length < 2) {
    passed = false;
    validation.lastName = "Last name should be at least 2 characters long.";
  }

  if (email.trim().length === 0) {
    passed = false;
    validation.email = "E-mail can not be empty";
  } else if (!regEx.test(email)) {
    passed = false;
    validation.email = "E-mail is not in correct Format";
  }

  if (password.trim().length == 0) {
    passed = false;
    validation.password = "Password can not be empty";
  } else if (password.trim().length < 6) {
    passed = false;
    validation.password = "Password must be of minimum length of 6 characters";
  } else if (password.trim().length > 12) {
    passed = false;
    validation.password = "Password can't exceed 12 charaters";
  } else if (!Regex1.test(password)) {
    passed = false;
    validation.password = "Password must contain a uppercase letter";
  } else if (!Regex2.test(password)) {
    passed = false;
    validation.password = "Password must contain a lowercase letter";
  } else if (!Regex3.test(password)) {
    passed = false;
    validation.password = "Password must contain a numeric character";
  } else if (!Regex4.test(password)) {
    passed = false;
    validation.password =
      "Password must contain a special character letter like !@#$%^&*";
  }

  if (passed) {
    //Assignment 4
    const user = new userModel({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
    });

    user
      .save()
      .then((userSaved) => {
        // User was saved correctly.
        console.log(
          `User ${userSaved.firstName} has been added to the database.`
        );
        // res.redirect("/");
      })
      .catch((err) => {
        console.log(`Error adding user to the database ... ${err}`);
        res.redirect("/");
      });
    //
    const sgMail = require("@sendgrid/mail");
    sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

    const msg = {
      to: email,
      from: "jhans2@myseneca.ca",
      subject: "Success, New User Rigersterd",
      html: `Hello ${firstName} ${lastName},<br><br>
      Thank you for registering with us, We hope you will enjoy and learn about new dishes.<br><br>
      Regards,<br>
      Jatin hans.<br>
      Website Visited: Agro Foods Limited<br>
              `,
    };
    sgMail
      .send(msg)
      .then(() => {
        res.render("welcome", {
          firstName,
          lastName,
        });
      })
      .catch((err) => {
        console.log(`Error ${err}`);

        res.render("Registration.hbs", {
          values: req.body,
          validation,
        });
      });
  } else {
    res.render("Registration", {
      values: req.body,
      validation,
    });
  }
});
////////////////////////////////

router.get("/Sign-in", (req, res) => {
  res.render("Sign-in", {});
});

router.post("/Sign-in", (req, res) => {
  console.log(req.body);

  const { email, password, Login_type } = req.body;

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
    // res.send("You logged in successfully!!!!");
    //Assignment 4
    let errors = [];

    // Search MongoDB for a document with the matching email address.
    userModel
      .findOne({
        email: req.body.email,
      })
      .then((user) => {
        // Completed the search.
        if (user) {
          // Found the user document.
          // Compare the password entered in the form with the one in the user document.
          bcrypt
            .compare(req.body.password, user.password)
            .then((isMatched) => {
              // Done comparing the passwords.

              if (isMatched) {
                // Passwords match.
                // Create a new session and store the user document (object)
                // to the session.
                req.session.user = user;
                req.session.isClerk = req.body.Login_type;

                if (req.session.isClerk === "clerk") {
                  req.session.clerk = true;
                  res.redirect("clerkDash");
                } else {
                  req.session.clerk = false;
                  res.redirect("customerDash");
                }
              } else {
                // Passwords to not match.
                console.log("Passwords do not match.");
                errors.push(
                  "Sorry, your password does not match our database."
                );
                res.render("Sign-in", {
                  errors,
                });
              }
            })
            .catch((err) => {
              // Couldn't compare passwords.
              console.log(`Unable to compare passwords ... ${err}`);
              errors.push("Oops, something went wrong.");
              res.render("Sign-in", {
                errors,
              });
            });
        } else {
          // User was not found in the database.
          console.log("User not found in the database.");
          errors.push("Email not found in the database.");
          res.render("Sign-in", {
            errors,
          });
        }
      })
      .catch((err) => {
        // Couldn't query the database.
        console.log(`Error finding the user in the database ... ${err}`);
        errors.push("Oops, something went wrong.");

        res.render("Sign-in", {
          errors,
        });
      });
  } else {
    res.render("Sign-in", {
      values: req.body,
      validation,
    });
  }
});

router.get("/logout", (req, res) => {
  // Clear the session from memory.
  req.session.destroy();

  res.redirect("/Sign-in");
});

module.exports = router;