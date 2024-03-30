const { PrismaClient } = require("@prisma/client");
const { encrypt } = require("../middleware/password");

const prisma = new PrismaClient();

const getAllUsers = async (pageoffset) => {
  const { offset, limit } = pageoffset;
  try {
    const users = await prisma.Users.findMany({
      skip: parseInt(offset),
      take: parseInt(limit),
    });
    return users;
  } catch (error) {
    throw new Error("Something went wrong");
  }
};

const createUser = async (data) => {
  {
    const { user_name, email, phone } = data;

    data.password = await encrypt(data.password);

    const emailuser = await prisma.Users.findUnique({
      where: {
        email,
      },

      select: {
        id: true,
      },
    });

    const phoneuser = await prisma.Users.findUnique({
      where: {
        phone,
      },
      select: {
        id: true,
      },
    });

    const usernameuser = await prisma.Users.findUnique({
      where: {
        user_name,
      },
      select: {
        id: true,
      },
    });

    if (emailuser) {
      throw new Error(
        JSON.stringify({
          message: "Email already associated with another account",
          email,
          user_id: emailuser.id,
        })
      );
    } else if (phoneuser) {
      // throw new Error("Phone number already associated with another account" + phone + phoneuser);

      throw new Error(
        JSON.stringify({
          message: "Phone number already associated with another account",
          phone,
          user_id: phoneuser.id,
        })
      );
    } else if (usernameuser) {
      // throw new Error("Username already associated with another account" + user_name + usernameuser);

      throw new Error(
        JSON.stringify({
          message: "Username already associated with another account",
          user_name,
          user_id: usernameuser.id,
        })
      );
    } else {

      const user = await prisma.Users.create({ data });

      return {
        success: true,
        user,
      };
    }
  }
};

const deleteUser = async (user_name, email, phone) => {
  try {
    const user = await prisma.Users.delete({
      where: {
        user_name,
        email,
        phone,
      },
    });
    return {
      success: true,
      user,
    };
  } catch (error) {
    throw new Error(JSON.stringify({ message: "Something went wrong" }));
  }
};


module.exports = {
  getAllUsers,
  createUser,
  deleteUser,
};
