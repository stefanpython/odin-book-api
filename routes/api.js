const express = require("express");
const router = express.Router();
const passport = require("passport");
const user_controller = require("../controllers/userController");
const friendRequest_controller = require("../controllers/friendRController");
const post_controller = require("../controllers/postController");
const like_controller = require("../controllers/likeController");
const comment_controller = require("../controllers/commentController");
const profile_controller = require("../controllers/profileController");

router.get("/", (req, res, next) => {
  res.redirect("/posts");
});

// USER ROUTES
router.post("/sign-up", user_controller.signup);
router.post("/login", user_controller.login);
router.get("/users", user_controller.user_list);

// TEST USER
router.post("/test-user", user_controller.test_user);

// FRIEND REQUEST ROUTES
router.post(
  "/send-request",
  passport.authenticate("jwt", { session: false }),
  friendRequest_controller.send_request
);

router.post(
  "/decline-request",
  passport.authenticate("jwt", { session: false }),
  friendRequest_controller.decline_request
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
router.get(
  "/posts",
  passport.authenticate("jwt", { session: false }),
  post_controller.post_list
);

router.post(
  "/posts",
  passport.authenticate("jwt", { session: false }),
  post_controller.post_create
);
router.put(
  "/posts/:postId",
  passport.authenticate("jwt", { session: false }),
  post_controller.post_update
);
router.delete("/posts/:postId", post_controller.post_delete);

// LIKE/UNLIKE POST ROUTE
router.post(
  "/posts/:postId/like",
  passport.authenticate("jwt", { session: false }),
  like_controller.like_post
);

// COMMENT ROUTE
router.post(
  "/posts/:postId/comment",
  passport.authenticate("jwt", { session: false }),
  comment_controller.comment_create
);

// PROFILE ROUTE
router.get("/profile/:userId", profile_controller.user_profile);
router.put(
  "/profile/:userId/update",
  passport.authenticate("jwt", { session: false }),
  profile_controller.profile_update
);

module.exports = router;
