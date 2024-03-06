const express = require("express");
const {
  CreateUser,
  GetSpecificUser,
  GetAllUser,
  // changeUserPassword,
  updateUser,
  DeleteUser,
  uploadProductImages,
  resizeImage,

} = require("../controller/User.Controller");

const PostsRoute = require("./Post.Routes");

const Auth = require("../controller/Auth.Controller");
// const { BlockTest } = require("../controller/Block.Controller");


const router = express.Router();
router.use(Auth.protect);

// / POST   /products/jkshjhsdjh2332n/reviews
// GET    /products/jkshjhsdjh2332n/reviews
// GET    /products/jkshjhsdjh2332n/reviews/87487sfww3
router.use("/:userId/post", PostsRoute);

router
  .route("/")
  .get(  GetAllUser)
  .post(uploadProductImages, resizeImage, CreateUser);
router
  .route("/:id")
  .get(GetSpecificUser)
  .put(uploadProductImages, resizeImage, updateUser)
  .delete(DeleteUser);
// router.get("/changepassword/:id", changeUserPassword);

module.exports = router;
