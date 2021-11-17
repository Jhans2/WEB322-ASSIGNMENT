const express = require("express");
const router = express.Router();

// Route to the default home page
router.get("/", (req, res) => {
  res.render("/home", {});
});

module.exports = router;