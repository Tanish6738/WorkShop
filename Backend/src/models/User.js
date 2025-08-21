const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    avatarUrl: { type: String },
    bio: { type: String },
    oauthProviders: [{ provider: String, providerId: String }],
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      index: true,
    },
    banned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
