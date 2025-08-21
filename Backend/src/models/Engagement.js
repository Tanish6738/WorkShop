const mongoose = require("mongoose");
const { Schema } = mongoose;

const engagementSchema = new Schema(
  {
    promptId: { type: Schema.Types.ObjectId, ref: "Prompt", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["like", "favorite"], required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

engagementSchema.index({ promptId: 1, userId: 1, type: 1 }, { unique: true });

module.exports = mongoose.model("Engagement", engagementSchema);
