const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("/home", {
    // title: "Home Page"
  });
});

router.get("/Registration", (req, res) => {
  res.render("Registration", {
    // title: "Contact Us Page",
  });
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
    // First name is not a string.... or, first name is an empty string.
    passed = false;
    validation.firstName = "You must specify a first name.";
  } else if (typeof firstName !== "string" || firstName.trim().length < 2) {
    // First name is not a string.... or, first name is less than two characters.
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
  }else if (password.trim().length < 6) {
    passed = false;
    validation.password = "Password must be of minimum length of 6 characters";
  }else if (password.trim().length > 12) {
    passed = false;
    validation.password = "Password can't exceed 12 charaters";
  }else if (!Regex1.test(password)) {
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
    validation.password = "Password must contain a special character letter like !@#$%^&*";
  } 
  
  
  
  // else if (!strongRegex.test(password)) {
  //   passed = false;
  //   validation.password = "Password is not in correct Format";
  // }

  if (passed) {
    // const sgMail = require("@sendgrid/mail");
    // sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

    // const msg = {
    //   to: email,
    //   from: "jhans2@myseneca.ca",
    //   subject: "Success, New User Rigersterd",
    //   html: `Hello ${firstName} ${lastName},<br><br>
    //   Thank you for registering with us, We hope you will enjoy and learn about new dishes.<br><br>
    //   Regards,<br>
    //   Jatin hans.<br>
    //   Website Visited: Agro Foods Limited<br>
    //           `,
    // };

    // sgMail
    //   .send(msg)
    //   .then(() => {
    //     // Validation passed, sent out an email.
    //     res.render("welcome");
    //   })
    //   .catch((err) => {
    //     console.log(`Error ${err}`);

    //     res.render("Registration", {
    //       //   title: "Contact Us Page",
    //       values: req.body,
    //       validation,
    //     });
    //   });
    res.render("welcome");
  } else {
    res.render("Registration", {
      //   title: "Contact Us Page",
      values: req.body,
      validation,
    });
  }
});

module.exports = router;
