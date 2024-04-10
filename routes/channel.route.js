const express = require("express");
const router = express.Router();
const { authorized } = require("../controllers/auth.controller");
const { getChannelsByUserId, createNewChannel } = require("../controllers/channel.controller");


router.get("/get_channels/:userId", authorized, getChannelsByUserId);
router.post("/add_channel", authorized, createNewChannel);

module.exports = router;