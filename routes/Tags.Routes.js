const express = require("express");
const { CreateTags } = require("../controller/Tags.Controller");

const router = express.Router();

router.route("/").get(CreateTags);

module.exports = router;
