const express = require("express");
const router = express.Router();
const { authorized } = require("../controllers/auth.controller");
const { getMessagesByChannelId, createNewMessage } = require("../controllers/message.controller");


router.get("/get_messages/:channelId", authorized, getMessagesByChannelId);
router.post("/add_message", authorized, createNewMessage);

module.exports = router;