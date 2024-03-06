const express = require("express");

const {
  followUser,
  UnFollowUser,
  getFollowerUser,
  GetAllFollowers,
  GetAllFollowing,
} = require("../controller/Followers.Controller");

const Auth = require("../controller/Auth.Controller");

const router = express.Router();
router.use(Auth.protect);

router.get("/followers", getFollowerUser, GetAllFollowers);
// user followers route
router.get("/following", getFollowerUser, GetAllFollowing);

router.put("/:id/follow", followUser);
router.put("/:id/unfollow", UnFollowUser);

module.exports = router;
