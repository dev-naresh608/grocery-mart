import User from "./user.model.js";

export const createUserSvc = async (payload, session) => {
  const users = await User.create([payload], { session });
  return users[0];
};

export const findUserByEmail = async (email) => {
  return await User.findOne({
    email,
  });
};

export const findUserByPhone = async (phone) => {
  return await User.findOne({
    phone,
  });
};

export const findUserById = async (userId) => {
  return await User.findById(userId);
};
