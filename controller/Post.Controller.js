// const multer = require("multer");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
// const sharp = require("sharp");
// const { v4: uuidv4 } = require("uuid");
const PostModel = require("../models/Post.Model");
const ApiError = require("../utilities/ApiError");
const UserModel = require("../models/User.Model");
// const { uploadMixOfImages } = require("../middlewares/UploadImage.MiddleWare");
const { UploadMixOfVideo } = require("../middlewares/UploadVideo.MiddleWare");
const { CreateModal, GetAllModal, GetSpecificModal, UpdateModal, DeleteModal } = require("./HandlerFactor");

exports.CreateFilterObj = (req, res, next) => {
  if (!req.body.user) req.body.user = req.params.userId;

  next();
};


exports.uploadProductImages = UploadMixOfVideo([
  {
    name: "image",
    maxCount: 1,
  },
  {
    name: "video",
    maxCount: 1,
  },
]);



exports.resizeAllImages = asyncHandler(async (req, res, next) => {

  if (Array.isArray( req.files.video)) {
    const fileName = req.files.video[0].filename
    req.body.video=fileName
//     req.body.video = [];
//     await Promise.all(
//       // eslint-disable-next-line array-callback-return
//       req.files.video.map( (vid) => {
    
//         // save images in db
//         req.body.video.push(vid.filename);
//       })
//     );
//     // next();
  }


  if (Array.isArray( req.files.image)) {
    
    const fileName = req.files.image[0].filename
    req.body.image=fileName
    // req.body.image = [];.
//     await Promise.all(
//       // eslint-disable-next-line array-callback-return
//       req.files.image.map( (vid) => {
    
//         // save images in db
//         req.body.image.push(vid.filename);
//       })
//     );
//     // next();
  }
  next()
});


exports.CreatePost = CreateModal(PostModel)

exports.GetSpecificPost = GetSpecificModal(PostModel,'comment')

// nested posts
exports.GetFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.userId) filterObject = { user: req.params.userId };
  req.filterObj = filterObject;
  next();
};

exports.GetAllPost = GetAllModal(PostModel)

exports.updatePost = UpdateModal(PostModel)

exports.DeletePost = DeleteModal(PostModel)





// like/dislike a post
exports.likePost = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const post = await PostModel.findById(id);

  if (!post) {
    return next(new ApiError(`No post for this id ${id}`, 404));
  }

  if (!post.likes.includes(req.user._id)) {
    await post.updateOne({ $push: { likes: req.user._id } }).populate("likes");
    res.status(200).json("Post liked");
  } else {
    await post.updateOne({ $pull: { likes: req.user._id } });
    res.status(200).json("Post Unliked");
  }
});

// Get Timeline POsts
exports.getTimelinePosts = asyncHandler(async (req, res, next) => {
  // const userId = req.params.id;
  const userId = req.user._id;

  const currentUserPosts = await PostModel.find({ user: userId }).sort(
    "-createdAt"
  )

  const followingPosts = await UserModel.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(userId),
      },
    },

    
    {
      $lookup: {
        from: "posts",
        localField: "following",
        foreignField: "user",
        as: "followingPosts",
      },
    },

   

    {
      $project: {
        followingPosts: 1,
        _id: 0,
      },
    },
  ]);

  const timeline = currentUserPosts
    .concat(...followingPosts[0].followingPosts)
    .sort((a, b) => b.createdAt - a.createdAt);

  res.status(200).json({
    status: "success",
    result: timeline.length,
    data: timeline,
  });
});
