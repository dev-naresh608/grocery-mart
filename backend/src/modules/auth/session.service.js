const { SessionModel } = require("./session.model");

const createSessionSvc = async (payload) => {
  const session = await SessionModel.create([payload]);
  console.log("In session serrvices");
  console.log(session);
  return session;
};

const deleteSessionSvc = async () => {};

const deleteAllSessionsSvc = async () => {};

const findSessionByRefreshTokenSvc = async () => {};

const findSessionsByUserIdSvc = async () => {};

const updateRefreshTokenSvc = async () => {};

module.exports = {
  createSessionSvc,
  deleteSessionSvc,
  deleteAllSessionsSvc,
  findSessionByRefreshTokenSvc,
  findSessionsByUserIdSvc,
  updateRefreshTokenSvc,
};
