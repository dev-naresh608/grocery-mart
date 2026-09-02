import User from "./user.model.js";

export const createUserSvc = async (payload, session) => {
  const users = await User.create([payload], { session });
  return users[0];
};

export const findUserByEmail = async (email) => {
  if (!email) return null;
  return await User.findOne({
    email: email.toLowerCase().trim(),
  }).lean();
};

export const findUserByPhone = async (phone) => {
  if (!phone) return null;
  return await User.findOne({
    phone: phone.trim(),
  }).lean();
};

export const findUserById = async (userId) => {
  if (!userId) return null;
  return await User.findById(userId).lean();
};

// export const checkIsUserExistSvc = async => {

// }