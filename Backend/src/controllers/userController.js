const User = require("../models/User");
const Prompt = require("../models/Prompt");
const Collection = require("../models/Collection");
const respond = require("../utils/apiResponse");
const { error } = respond;

async function getUserProfile(req, res) {
  try {
    const user = await User.findById(req.params.id).select(
      "name avatarUrl bio"
    );
    if (!user) return error(res, "NOT_FOUND", "User not found", 404);
    const [promptCount, collectionCount] = await Promise.all([
      Prompt.countDocuments({ createdBy: user._id, visibility: "public" }),
      Collection.countDocuments({ createdBy: user._id, visibility: "public" }),
    ]);
    return respond(res, {
      id: user._id,
      name: user.name,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      promptCount,
      collectionCount,
    });
  } catch (e) {
    return error(res, "SERVER_ERROR", e.message);
  }
}

async function userPrompts(req, res) {
  try {
    const prompts = await Prompt.find({
      createdBy: req.params.id,
      visibility: "public",
    });
    return respond(res, prompts);
  } catch (e) {
    return error(res, "SERVER_ERROR", e.message);
  }
}

async function userCollections(req, res) {
  try {
    const colls = await Collection.find({
      createdBy: req.params.id,
      visibility: "public",
    });
    return respond(res, colls);
  } catch (e) {
    return error(res, "SERVER_ERROR", e.message);
  }
}

module.exports = { getUserProfile, userPrompts, userCollections };
