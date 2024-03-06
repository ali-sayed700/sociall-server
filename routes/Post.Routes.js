const express = require("express");
const {
  CreatePost,
  GetAllPost,
  GetSpecificPost,
  updatePost,
  DeletePost,
  getTimelinePosts,
  likePost,
  GetFilterObj,
  CreateFilterObj,
  resizeAllImages,
  uploadProductImages,

} = require("../controller/Post.Controller");

const CommentRoute = require("./Comment.Routes");


const Auth = require("../controller/Auth.Controller");
const { CreatePostValidator } = require("../utilities/validation/Post.Validation");
// const { UploadVideo } = require("../middlewares/UploadVideo.MiddleWare");

const router = express.Router({ mergeParams: true });



// # nested route
router.use("/:postId/comment", CommentRoute);

router.use(Auth.protect);
router.get("/timeline", getTimelinePosts);
router
.route("/")
  .post(
    // uploadPostImage,
    uploadProductImages,
    resizeAllImages,
    // UploadVideo,
    CreateFilterObj,
    CreatePostValidator,
    CreatePost
  )
  .get(GetFilterObj, GetAllPost);
router
  .route("/:id")
  .get(GetSpecificPost)
  .put(uploadProductImages , updatePost)
  .delete(DeletePost);
  router.put("/:id/likes", likePost);
  module.exports = router;
  