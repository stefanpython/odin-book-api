const express = require("express");
const router = express.Router();
const passport = require("passport");
const user_controller = require("../controllers/userController");
const friendRequest_controller = require("../controllers/friendRController");

router.get("/", (req, res, next) => {
  res.json("TODO: -- ROUTE API HERE");
});

// User routes
router.post("/sign-up", user_controller.signup);
router.post("/login", user_controller.login);

// Friend request routes
router.post(
  "/send-request",
  passport.authenticate("jwt", { session: false }),
  friendRequest_controller.send_request
);
router.post(
  "/accept-request",
  passport.authenticate("jwt", { session: false }),
  friendRequest_controller.accept_request
);
router.get(
  "/request-list/:userId",
  passport.authenticate("jwt", { session: false }),
  friendRequest_controller.request_list
);

module.exports = router;
