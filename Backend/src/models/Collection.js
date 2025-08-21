const mongoose = require("mongoose");
const { Schema } = mongoose;

const collectionSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    promptIds: [{ type: Schema.Types.ObjectId, ref: "Prompt" }],
  },
  { timestamps: true }
);

collectionSchema.index({ createdBy: 1, visibility: 1 });

module.exports = mongoose.model("Collection", collectionSchema);
