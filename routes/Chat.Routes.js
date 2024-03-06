const express = require("express");
const {
  createChat,
  userChats,
  findChat,
  deleteChat
} = require("../controller/Chat.Controller");

const router = express.Router();

router.post("/", createChat);
router.get("/:userId", userChats);
router.get("/find/:firstId/:secondId", findChat);
router.delete("/:id",deleteChat);
module.exports = router;
