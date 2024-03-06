const express = require("express");

const {
  CreateComment,
  GetAllComments,
  GetOneComment,
  UpdateComment,
  DeleteComment,
  setCommentPost,
  GetCommentPost,
} = require("../controller/Comment.Controller");
const Auth = require("../controller/Auth.Controller");

const router = express.Router({ mergeParams: true });

router.use(Auth.protect);

router
  .route("/")
  .post(setCommentPost, CreateComment)
  .get(GetCommentPost, GetAllComments);
router
  .route("/:id")
  .get(GetOneComment)
  .put(UpdateComment)
  .delete(DeleteComment);
module.exports = router;
