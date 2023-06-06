const express = require("express");
const router = express.Router();
const user_controller = require("../controllers/userController");

router.get("/", (req, res, next) => {
  res.json("TODO: -- ROUTE API HERE");
});

// User routes
router.post("/sign-up", user_controller.signup);
router.post("/login", user_controller.login);

module.exports = router;
