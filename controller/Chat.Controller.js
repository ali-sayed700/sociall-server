const asyncHandler = require("express-async-handler");
const ChatModel = require("../models/Chat.Model");
const ApiError = require("../utilities/ApiError");

exports.createChat = asyncHandler(async (req, res, next) => {
  //   const newChat = new ChatModel({
  //     members: [req.body.senderId, req.body.receiverId],
  //   });
  const newChat = await ChatModel.create({
    members: [req.body.senderId, req.body.receiverId],
  });
 

  if (!newChat) {
    return next(new ApiError(`no chat in this `, 403));
  }

  res.status(200).json({ status: "success", data: newChat });
});

exports.userChats = asyncHandler(async (req, res, next) => {
  const chat = await ChatModel.find({
    members: { $in: [req.params.userId] },
  });

  // if (!chat) {
  //   return next(new ApiError(`no chat in this `, 403));
  // }
  res.status(200).json({ status: "success", data: chat });
});

exports.findChat = asyncHandler(async (req, res, next) => {
  const chat = await ChatModel.findOne({
    members: { $all: [req.params.firstId, req.params.secondId] },
  });
  // if (!chat) {
  //   return next(new ApiError(`no chat in this `, 403));
  // }

  res.status(201).json({ status: "success", data: chat});
});



exports.deleteChat = asyncHandler(async (req, res, next) => {
  const chat = await ChatModel.findOneAndDelete(req.params.id);
  if (!chat) {
    return next(new ApiError(`no chat in this `, 403));
  }
  res.status(200).json({ status: "success"});
});
