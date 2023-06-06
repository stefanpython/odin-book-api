const express = require("express");
const router = express.Router();
const passport = require("passport");
const user_controller = require("../controllers/userController");
const friendRequest_controller = require("../controllers/friendRController");
const post_controller = require("../controllers/postController");

router.get("/", (req, res, next) => {
  res.json("TODO: -- ROUTE API HERE");
});

// USER ROUTES
router.post("/sign-up", user_controller.signup);
router.post("/login", user_controller.login);

// FRIEND REQUEST ROUTES
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

// POST ROUTES
router.post(
  "/posts",
  passport.authenticate("jwt", { session: false }),
  post_controller.post_create
);
router.get("/posts");
router.put("/posts/:postId");
router.delete("/posts/:postId");

module.exports = router;
