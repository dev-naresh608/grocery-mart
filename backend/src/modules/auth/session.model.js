const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },

    refreshTokenHash: {
      type: String,
      required: [true, "Refresh token hash is required"],
    },

    ip: {
      type: String,
      default: "Not provided",
    },

    userAgent: {
      type: String,
      default: "Not provided",
    },
    revoked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

sessionSchema.index({ refreshTokenHash: 1 });
sessionSchema.index({ user: 1 });

const SessionModel =
  mongoose.models.sessions || mongoose.model("sessions", sessionSchema);

module.exports = { SessionModel };
