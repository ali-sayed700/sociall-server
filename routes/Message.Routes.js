const express = require("express");
const { addMessage, getMessages, uploadProductImages, resizeAllImages } = require("../controller/Message.Controller");

const router = express.Router();

router.post("/", uploadProductImages,resizeAllImages,addMessage);

router.get("/:chatId", getMessages);

module.exports = router;
