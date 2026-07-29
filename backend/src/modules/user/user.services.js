const { User } = require("./user.model");

const createUserSvc = async (payload, session) => {
  const users = await User.create([payload], { session });
  return users[0];
};

const checkIsUserExistSvc = async (value) => {
  return await User.findOne({
    email: value,
  });
};

module.exports = {
  createUserSvc,
  checkIsUserExistSvc,
};
