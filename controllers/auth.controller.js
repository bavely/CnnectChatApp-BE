const { createUser, deleteUser } = require("../services/user.service");
const { generateAuthToken, validateToken } = require("../services/token.service");
const { logIn } = require("../services/auth.service");
const {accessTokenValidate} = require("../middleware/token");

const register = async (req, res) => {

  try {
    const user = await createUser(req.body);
    const token = await generateAuthToken(user.user);
    // res.cookie("refresh_token", token.refresh.refreshToken, {
    //   httpOnly: true,
    //   sameSite: "none",
    //   secure: true,
    // });
    res.status(201).json({ user, access_token : token.access });
  } catch (error) {
    let errorObj = JSON.parse(error.message);
    errorObj.user_id === undefined &&
      deleteUser(req.body.user_name, req.body.email, req.body.phone);
    res.status(500).json({ error: errorObj });
  }
};

const login = async (req, res) => {

  try {
    const user_access = req.body.user_name || req.body.email || req.body.phone;
    const password = req.body.password;
    const register_source = req.body.register_source;
    const user = await logIn(user_access, password, register_source);
    const token = await generateAuthToken(user);
    // res.cookie("refresh_token", token.refresh.refreshToken, {
    //   httpOnly: true,
    //   sameSite: "none",
    //   secure: true,
    // });
    res.status(200).json({ user, access_token : token.access });
  } catch (error) {
 
    JSON.parse(error.message).message === "User not found" ?
      res.status(404).json({ error: JSON.parse(error.message) }) : res.status(500).json({ error: JSON.parse(error.message) });
  }
};

const logOut = async (req, res) => {
  try {
    const { refresh_token } = req.cookies;
    await validateToken(refresh_token, "refresh");
    res.clearCookie("refresh_token", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {

    res.status(500).json({ error: JSON.parse(error.message) });
  }
};

const refreshToken = async (req, res) => {

  try {
    const { refresh_token } = req.cookies;
    const validate = await validateToken(refresh_token, "refresh");
    const token = await generateAuthToken({id : validate.user_id});
    res.cookie("refresh_token", token.refresh.refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.status(201).json({ access_token: token.access });
  } catch (error) {

    JSON.parse(error.message).message === "Token expired" ?
      res.status(403).json({ error: JSON.parse(error.message) }) : JSON.parse(error.message).message === "Token not valid" || JSON.parse(error.message).message === "Token blacklisted" ?
      res.status(401).json({ error: JSON.parse(error.message) }) : res.status(500).json({ error: JSON.parse(error.message) });
  }
};

const authorized = async (req, res, next) => {

  try {
    const {authorization} = req.headers;
    const token = authorization.split(" ")[1];

    if (accessTokenValidate(token)) {
      next();
    }else{
      res.status(401).json({ error: "Unauthorized" });
    }

  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  authorized,
  logOut,
};
