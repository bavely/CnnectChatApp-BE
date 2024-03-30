const express = require("express");
const router = express.Router();
const { getUsers, createNewUser } = require("../controllers/user.controller");
const { authorized } = require("../controllers/auth.controller");

router.get("/get_users", authorized, getUsers);
router.post("/add_user", authorized, createNewUser);

module.exports = router;
