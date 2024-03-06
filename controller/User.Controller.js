const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
// const bcrypt = require("bcryptjs");
const UserModel = require("../models/User.Model");

const { CreateModal, GetAllModal, GetSpecificModal, UpdateModal, DeleteModal } = require("./HandlerFactor");

const {

  uploadMixOfImages,
} = require("../middlewares/UploadImage.MiddleWare");


exports.uploadProductImages = uploadMixOfImages([
  {
    name: "profilePicture",
    maxCount: 1,
  },
  {
    name: "coverPicture",
    maxCount: 1,
  },
]);


// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (req.files.profilePicture) {

    const profileImg = `users-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.files.profilePicture[0].buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/users/${profileImg}`);
    // Save image into our db
    req.body.profilePicture = profileImg;
    
   


  }
  if (req.files.coverPicture) {
    const coverImg = `users-${uuidv4()}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.coverPicture[0].buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/users/${coverImg}`);

    // Save image into our db
    req.body.coverPicture = coverImg;
  
  
  }
  next()

});



exports.CreateUser = CreateModal(UserModel)

exports.GetAllUser = GetAllModal(UserModel,"user" )

exports.GetSpecificUser = GetSpecificModal(UserModel , "following")


exports.updateUser =UpdateModal(UserModel)

exports.DeleteUser = DeleteModal(UserModel)

