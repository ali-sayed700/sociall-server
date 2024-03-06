
const CommentModel = require("../models/Comment.Model");

const { CreateModal, GetAllModal, GetSpecificModal, UpdateModal, DeleteModal } = require("./HandlerFactor");

// created for nested route
exports.setCommentPost = (req, res, next) => {
  if (!req.body.post) req.body.post = req.params.postId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

// # nested route Get api/v1/post/:postId/comment
exports.GetCommentPost = (req, res, next) => {
  let FiltersObject = {};
  if (req.params.postId) FiltersObject = { post: req.params.postId };
  req.filterObj = FiltersObject;
  next();
};

// creating comment
exports.CreateComment = CreateModal(CommentModel)

// get all  comment
exports.GetAllComments = GetAllModal(CommentModel)

// get specific  comment
exports.GetOneComment = GetSpecificModal(CommentModel)

// update specific comment

exports.UpdateComment = UpdateModal( CommentModel )

exports.DeleteComment = DeleteModal( CommentModel )