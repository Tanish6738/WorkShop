const Engagement = require("../models/Engagement");
const Prompt = require("../models/Prompt");
const respond = require("../utils/apiResponse");
const { error } = respond;

async function favoritePrompt(req, res) {
  try {
    const promptId = req.params.id;
    await Engagement.updateOne(
      { promptId, userId: req.user._id, type: "favorite" },
      {},
      { upsert: true, setDefaultsOnInsert: true }
    );
    await Prompt.findByIdAndUpdate(promptId, {
      $inc: { "stats.favorites": 1 },
    });
    return respond(res, { favorited: true });
  } catch (e) {
    return error(res, "SERVER_ERROR", e.message);
  }
}
async function unfavoritePrompt(req, res) {
  try {
    const promptId = req.params.id;
    const deleted = await Engagement.findOneAndDelete({
      promptId,
      userId: req.user._id,
      type: "favorite",
    });
    if (deleted)
      await Prompt.findByIdAndUpdate(promptId, {
        $inc: { "stats.favorites": -1 },
      });
    return respond(res, { favorited: false });
  } catch (e) {
    return error(res, "SERVER_ERROR", e.message);
  }
}
async function getEngagement(req, res) {
  try {
    const promptId = req.params.id;
    const likes = await Engagement.countDocuments({ promptId, type: "like" });
    const favorites = await Engagement.countDocuments({
      promptId,
      type: "favorite",
    });
    return respond(res, { likes, favorites });
  } catch (e) {
    return error(res, "SERVER_ERROR", e.message);
  }
}
async function listFavorites(req, res) {
  try {
    const favs = await Engagement.find({
      userId: req.user._id,
      type: "favorite",
    }).populate("promptId");
    return respond(
      res,
      favs.map((f) => f.promptId)
    );
  } catch (e) {
    return error(res, "SERVER_ERROR", e.message);
  }
}
async function listLikes(req, res) {
  try {
    const likes = await Engagement.find({
      userId: req.user._id,
      type: "like",
    }).populate("promptId");
    return respond(
      res,
      likes.map((l) => l.promptId)
    );
  } catch (e) {
    return error(res, "SERVER_ERROR", e.message);
  }
}

module.exports = {
  favoritePrompt,
  unfavoritePrompt,
  getEngagement,
  listFavorites,
  listLikes,
};
