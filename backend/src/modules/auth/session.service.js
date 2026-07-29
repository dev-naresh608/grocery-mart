const crypto = require("crypto");
const { SessionModel } = require("./session.model");

/**
 * Generates a deterministic SHA-256 hash of a token for DB storage & lookup.
 */
const hashToken = (token) => {
  if (!token) return "";
  return crypto.createHash("sha256").update(token).digest("hex");
};

const createSessionSvc = async (payload, session) => {
  const sessionData = {
    ...payload,
    refreshTokenHash: hashToken(payload.refreshToken),
  };
  delete sessionData.refreshToken;

  const options = session ? { session } : {};
  const created = await SessionModel.create([sessionData], options);
  return created[0];
};

const findSessionByRefreshTokenSvc = async (refreshToken) => {
  const refreshTokenHash = hashToken(refreshToken);
  return await SessionModel.findOne({
    refreshTokenHash,
    revoked: false,
  });
};

const revokeSessionSvc = async (refreshToken) => {
  const refreshTokenHash = hashToken(refreshToken);
  return await SessionModel.findOneAndUpdate(
    { refreshTokenHash, revoked: false },
    { revoked: true },
    { new: true }
  );
};

const revokeAllUserSessionsSvc = async (userId) => {
  return await SessionModel.updateMany(
    { user: userId, revoked: false },
    { revoked: true }
  );
};

module.exports = {
  hashToken,
  createSessionSvc,
  findSessionByRefreshTokenSvc,
  revokeSessionSvc,
  revokeAllUserSessionsSvc,
};
