const mongoose = require("mongoose");
const { Schema } = mongoose;

const versionSchema = new Schema(
  {
    versionNumber: Number,
    content: String,
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const promptSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    content: { type: String, required: true },
    category: { type: String },
    tags: [{ type: String, index: true }],
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    originalPromptId: { type: Schema.Types.ObjectId, ref: "Prompt" },
    versions: [versionSchema],
    stats: {
      views: { type: Number, default: 0 },
      likes: { type: Number, default: 0 },
      favorites: { type: Number, default: 0 },
      remixes: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

promptSchema.index({ title: "text", description: "text", content: "text" });

module.exports = mongoose.model("Prompt", promptSchema);
