const bcrypt = require("bcryptjs");

const encrypt = async (rawPassword) => {
  const hash = await bcrypt.hashSync(rawPassword);

  return hash;
};

const validate = async (rawPassword, hashPassword) => {
  const match = await bcrypt.compareSync(rawPassword, hashPassword);
  return match;
};

module.exports = {
  encrypt,
  validate,
};
