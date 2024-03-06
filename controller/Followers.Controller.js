const asyncHandler = require("express-async-handler");
const ApiError = require("../utilities/ApiError");
const UserModel = require("../models/User.Model");

// Follow a User
exports.followUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const followUser = await UserModel.findById(id); //followers from id
  const followingUser = await UserModel.findById(req.user._id); // following
  if (req.user._id === id) {
    return next(new ApiError(`Action forbidden`, 403));
  }

  if (!followUser.followers.includes(req.user._id)) {


  await followUser.updateOne({ $push: { followers: req.user._id } });
    await followingUser.updateOne({ $push: { following: id } });

    res.status(200).json({
      status: "success",
      message: "User followed!.",
    });
  } 
  
  else {
    return next(new ApiError(`User is Already followed by you!`, 403));
  }
});

// UnFollow a User
exports.UnFollowUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (req.user._id === id) {
    return next(new ApiError(`Action forbidden`, 403));
  }

  const followUser = await UserModel.findById(id);
  const followingUser = await UserModel.findById(req.user._id);

  if (followUser.followers.includes(req.user._id)) {
    await followUser.updateOne({ $pull: { followers: req.user._id } });
    await followingUser.updateOne({ $pull: { following: id } });
    res.status(200).json({
      status: "success",
      message: "User Unfollowed.",
    });
  } else {
    return next(new ApiError(`User is not followed by you`, 403));
  }
});

exports.getFollowerUser = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

exports.GetAllFollowers = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const follower = await UserModel.findById(id);

  if (!follower) {
    return next(new ApiError(`no followers in `, 403));
  }
  //   console.log(follower);

  res.status(200).json({
    status: "success",
    data: follower.followers,
    message: "followers who follow you.",
  });
});

exports.GetAllFollowing = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const followings = await UserModel.findById(id).populate("following");

  if (!followings) {
    return next(new ApiError(`no followings in `, 403));
  }

  res.status(200).json({
    status: "success",
    data: followings.following,
    message: "followings who follow hem.",
  });
});
