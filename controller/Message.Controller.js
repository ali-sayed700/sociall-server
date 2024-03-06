// const { v4: uuidv4 } = require("uuid");
// const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const MessageModel = require("../models/Message.Model");
const ApiError = require("../utilities/ApiError");
const {  UploadMixOfMessage } = require("../middlewares/UploadFileMessage.MiddleWare");
// const { UploadMixOfVideo } = require("../middlewares/UploadVideo.MiddleWare");






exports.uploadProductImages = UploadMixOfMessage([
  {
    name: "image",
    maxCount: 5,
  },
  {
    name: "video",
    maxCount: 5,
  },
]);
// exports.uploadProductImages = UploadMixOfMessage("video",10);

// exports.resizeAllImages = asyncHandler(async (req, res, next) => {
//   if(req.files.video) {
//     console.log(req.files);
   

//   }
//   if (req.files.image) {
//     req.body.image = [];
//     await Promise.all(
//       req.files.image.map(async (img, index) => {
//         const imageName = `message-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
//         await sharp(img.buffer)
//           .resize(2000, 1333)
//           .toFormat("jpeg")
//           .jpeg({ quality: 100 })
//           .toFile(`uploads/messages/${imageName}`);
//         // save images in db
//         req.body.image.push(imageName);
//       })
//     );
//     next();
//   }
// });



exports.resizeAllImages = asyncHandler(async (req, res, next) => {

  if (req.files.video) {
    
    req.body.video = [];
    await Promise.all(
      // eslint-disable-next-line array-callback-return
      req.files.video.map( (vid) => {
    
        // save images in db
        req.body.video.push(vid.filename);
      })
    );
    // next();
  }


  if (req.files.image) {
    req.body.image = [];
    // await Promise.all(
      // eslint-disable-next-line array-callback-return
      req.files.image.map( (vid) => {
    
        // save images in db
        req.body.image.push(vid.filename);
      })
    // );
    // next();
  }
  next()
});


exports.addMessage = asyncHandler(async (req, res, next) => {

  // const { chatId, senderId, text } = req.body;

  const message = await MessageModel.create(req.body);
  if (!message) {
    return next(new ApiError(`no message in this `, 403));
  }
  res.status(200).json({ status: "success", data: message });
});

exports.getMessages = asyncHandler(async (req, res, next) => {
  const { chatId } = req.params;

  const message = await MessageModel.find({ chatId });
  if (!message) {
    return next(new ApiError(`no message in this `, 403));
  }
  res.status(200).json({ status: "success", data: message });
});
