const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { validate } = require("../middleware/password");

const logIn = async (user_access, password, register_source) => {
  let type;
  let user;
  if (isNaN(user_access)) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(user_access)) {
      type = "email";
    } else {
      type = "user_name";
    }
  } else {
    type = "phone";
  }

  if (type === "user_name") {
    user = await prisma.Users.findUnique({
      where: {
        user_name: user_access,
      },
      
    });
  } else if (type === "email") {
    user = await prisma.Users.findUnique({
      where: {
        email: user_access,
      },
    });
  } else if (type === "phone") {
    user = await prisma.Users.findUnique({
      where: {
        phone: user_access,
      },
    });
  } else {
    throw new Error(JSON.stringify({ message: "User not found" }));
  }

  if (!user) {
    throw new Error(JSON.stringify({ message: "User not found" }));
  }

  const isMatch = await validate(password, user.password);
  if (!isMatch) {
    if (register_source === user.register_source) {
      throw new Error(JSON.stringify({ message: "Wrong password" }));
    }else{
      if (user.register_source === "form") {
        throw new Error(JSON.stringify({ message: "Try to login again using form." }));
      }else{
        throw new Error(JSON.stringify({ message: "Try to login again using google." }));
      }
    }
  }

  return user;
};

module.exports = {
  logIn,
};
