require("dotenv").config();

const secretPicker = (type) => {
  switch (type) {
    case "access":
      return process.env.JWT_ACCESS_TOKEN_SECRET;
    case "refresh":
      return process.env.JWT_REFRESH_TOKEN_SECRET;
    case "reset":
      return process.env.JWT_PASSWORD_RESET_TOKEN_SECRET;
    case "verify":
      return process.env.JWT_EMAIL_VERIFICATION_TOKEN_SECRET;
    default:
      return process.env.JWT_REFRESH_TOKEN_SECRET;
  }
};

module.exports = {
  secretPicker,
};
