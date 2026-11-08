const bcrypt = require('bcryptjs');

const encryptPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

module.exports = {
  encryptPassword,
  comparePassword,
};
