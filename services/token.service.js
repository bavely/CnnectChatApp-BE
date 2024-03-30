const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const moment = require("moment");
const { generateToken } = require("../middleware/token");
const jwt = require("jsonwebtoken");
const {secretPicker} = require("../config/tokens");
const saveToken = async (
  token,
  user_id,
  expire_time,
  type,
  blacklisted = false
) => {
  try {
    let payload = {
      token,
      user_id,
      expire_time: expire_time.toDate(),
      type,
      blacklisted,
    };

    const newToken = await prisma.Tokens.create({
      data: payload,
    });
    return newToken;
  } catch (error) {
    throw new Error(
      JSON.stringify({
        message: "Something went wrong",
      })
    );
  }
};



const generateAuthToken = async (user) => {
  try {
    const accessTokenExpires = moment().add(15, "m");
    const refreshTokenExpires = moment().add(4, "h");
    const accessToken = await generateToken(user.id, accessTokenExpires, "access");
    const refreshToken = await generateToken(user.id, refreshTokenExpires, "refresh");
    await saveToken(refreshToken, user.id, refreshTokenExpires, "refresh");

    return {
      access: {
        accessToken,
        expires: accessTokenExpires.toDate(),
      },
      refresh: {
        refreshToken,
        expires: refreshTokenExpires.toDate(),
      },
    };
  } catch (error) {

    throw new Error(
      JSON.stringify({
        message: "Something went wrong",
      })
    );
  }
};

const deleteToken = async (token, type, user_id) => {
  const tokenDoc = await prisma.Tokens.delete({
    where: {
      token,
      type,
    },
  });
  return tokenDoc;
};

const validateToken = async (token, type) => {
  try {

   const payload = jwt.decode(token);
  
  const tokenDoc = await prisma.Tokens.findUnique({
    where: {
      token,
      type,
      user_id: payload.sub,
    },
  });

  if (!tokenDoc) {
    throw new Error(JSON.stringify({ message: "Token not valid" }));
  }

  if (moment().isAfter(tokenDoc.expire_time)) {
    throw new Error(JSON.stringify({ message: "Token expired" }));
  }

  if (tokenDoc.blacklisted) {
    throw new Error(JSON.stringify({ message: "Token blacklisted" }));
  }
  await deleteToken(tokenDoc.token, tokenDoc.type, tokenDoc.user_id);
  return tokenDoc;
} catch (error) {
  throw new Error(error.message);
  
}
};

module.exports = {
  saveToken,
  generateAuthToken,
  validateToken,
  deleteToken,
};
