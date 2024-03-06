const express = require("express");
const {
  BlockUser,
  UnBlockUser,
  GetBlockUser
} = require("../controller/Block.Controller");





const router = express.Router();

const Auth = require("../controller/Auth.Controller");

router.use(Auth.protect);
router
  .route("/")
  .post(BlockUser)
  .get(GetBlockUser)
router
  .route("/api/unblock")
  .post(UnBlockUser)
 
// router.get("/changepassword/:id", changeUserPassword);

module.exports = router;
