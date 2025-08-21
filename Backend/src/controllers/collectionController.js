const Collection = require("../models/Collection");
const Prompt = require("../models/Prompt");
const respond = require("../utils/apiResponse");
const { error } = respond;

async function createCollection(req, res) {
  try {
    const { name, description, visibility = "public" } = req.body;
    if (!name) return error(res, "VALIDATION_ERROR", "Missing name", 400);
    const collection = await Collection.create({
      name,
      description,
      visibility,
      createdBy: req.user._id,
      promptIds: [],
    });
    return respond(res, collection, 201);
  } catch (e) {
    return error(res, "SERVER_ERROR", e.message);
  }
}

async function listCollections(req, res) {
  try {
    const page = parseInt(req.query.page || "1");
    const limit = parseInt(req.query.limit || "20");
    const skip = (page - 1) * limit;
    const filter = {};
    if (req.query.mine === "true" && req.user) {
      filter.createdBy = req.user._id;
      if (req.query.visibility) filter.visibility = req.query.visibility;
    } else {
      filter.visibility = "public";
      if (req.query.author) filter.createdBy = req.query.author;
    }
    const [items, total] = await Promise.all([
      Collection.find(filter).skip(skip).limit(limit),
      Collection.countDocuments(filter),
    ]);
    return respond(res, { page, limit, total, items });
  } catch (e) {
    return error(res, "SERVER_ERROR", e.message);
  }
}

async function getCollection(req, res) {
  try {
    const c = await Collection.findById(req.params.id).populate("promptIds");
    if (!c) return error(res, "NOT_FOUND", "Collection not found", 404);
    if (
      c.visibility !== "public" &&
      (!req.user || c.createdBy.toString() !== req.user._id.toString())
    ) {
      return error(res, "FORBIDDEN", "Not allowed", 403);
    }
    return respond(res, c);
  } catch (e) {
    return error(res, "SERVER_ERROR", e.message);
  }
}

async function updateCollection(req, res) {
  try {
    const c = await Collection.findById(req.params.id);
    if (!c) return error(res, "NOT_FOUND", "Collection not found", 404);
    if (c.createdBy.toString() !== req.user._id.toString())
      return error(res, "FORBIDDEN", "Not allowed", 403);
    const { name, description, visibility } = req.body;
    if (name !== undefined) c.name = name;
    if (description !== undefined) c.description = description;
    if (visibility !== undefined) c.visibility = visibility;
    await c.save();
    return respond(res, c);
  } catch (e) {
    return error(res, "SERVER_ERROR", e.message);
  }
}

async function deleteCollection(req, res) {
  try {
    const c = await Collection.findById(req.params.id);
    if (!c) return error(res, "NOT_FOUND", "Collection not found", 404);
    if (c.createdBy.toString() !== req.user._id.toString())
      return error(res, "FORBIDDEN", "Not allowed", 403);
    await c.deleteOne();
    return respond(res, { deleted: true });
  } catch (e) {
    return error(res, "SERVER_ERROR", e.message);
  }
}

async function addPrompt(req, res) {
  try {
    const c = await Collection.findById(req.params.id);
    if (!c) return error(res, "NOT_FOUND", "Collection not found", 404);
    if (c.createdBy.toString() !== req.user._id.toString())
      return error(res, "FORBIDDEN", "Not allowed", 403);
    const { promptId } = req.body;
    const prompt = await Prompt.findById(promptId);
    if (!prompt) return error(res, "NOT_FOUND", "Prompt not found", 404);
    if (!c.promptIds.includes(promptId)) c.promptIds.push(promptId);
    await c.save();
    return respond(res, c);
  } catch (e) {
    return error(res, "SERVER_ERROR", e.message);
  }
}

async function removePrompt(req, res) {
  try {
    const c = await Collection.findById(req.params.id);
    if (!c) return error(res, "NOT_FOUND", "Collection not found", 404);
    if (c.createdBy.toString() !== req.user._id.toString())
      return error(res, "FORBIDDEN", "Not allowed", 403);
    const { promptId } = req.params;
    c.promptIds = c.promptIds.filter((p) => p.toString() !== promptId);
    await c.save();
    return respond(res, c);
  } catch (e) {
    return error(res, "SERVER_ERROR", e.message);
  }
}

module.exports = {
  createCollection,
  listCollections,
  getCollection,
  updateCollection,
  deleteCollection,
  addPrompt,
  removePrompt,
};
