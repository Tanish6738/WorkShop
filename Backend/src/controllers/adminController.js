const User = require("../models/User");
const Prompt = require("../models/Prompt");
const Collection = require("../models/Collection");
const respond = require("../utils/apiResponse");
const { error } = respond;

async function platformStats(_req, res) {
  try {
    const [users, prompts, collections] = await Promise.all([
      User.countDocuments(),
      Prompt.countDocuments(),
      Collection.countDocuments(),
    ]);
    return respond(res, { users, prompts, collections });
  } catch (e) {
    return error(res, "SERVER_ERROR", e.message);
  }
}

async function listUsers(req, res) {
  try {
    const page = parseInt(req.query.page || "1");
    const limit = parseInt(req.query.limit || "20");
    const skip = (page - 1) * limit;
    const q = req.query.q;
    const filter = {};
    if (q)
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
      ];
    const [items, total] = await Promise.all([
      User.find(filter).skip(skip).limit(limit).select("-passwordHash"),
      User.countDocuments(filter),
    ]);
    return respond(res, { page, limit, total, items });
  } catch (e) {
    return error(res, "SERVER_ERROR", e.message);
  }
}

async function banUser(req, res) {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { banned: true },
      { new: true }
    ).select("-passwordHash");
    if (!user) return error(res, "NOT_FOUND", "User not found", 404);
    return respond(res, { id: user._id, banned: user.banned });
  } catch (e) {
    return error(res, "SERVER_ERROR", e.message);
  }
}

async function unbanUser(req, res) {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { banned: false },
      { new: true }
    ).select("-passwordHash");
    if (!user) return error(res, "NOT_FOUND", "User not found", 404);
    return respond(res, { id: user._id, banned: user.banned });
  } catch (e) {
    return error(res, "SERVER_ERROR", e.message);
  }
}

async function bulkUserRole(req, res) {
  try {
    const { userIds = [], role } = req.body;
    if (!["user", "admin"].includes(role))
      return error(res, "VALIDATION_ERROR", "Invalid role", 400);
    await User.updateMany({ _id: { $in: userIds } }, { role });
    return respond(res, { updated: userIds.length, role });
  } catch (e) {
    return error(res, "SERVER_ERROR", e.message);
  }
}

async function bulkBan(req, res) {
  try {
    const { userIds = [] } = req.body;
    await User.updateMany({ _id: { $in: userIds } }, { banned: true });
    return respond(res, { banned: userIds.length });
  } catch (e) {
    return error(res, "SERVER_ERROR", e.message);
  }
}

async function bulkUnban(req, res) {
  try {
    const { userIds = [] } = req.body;
    await User.updateMany({ _id: { $in: userIds } }, { banned: false });
    return respond(res, { unbanned: userIds.length });
  } catch (e) {
    return error(res, "SERVER_ERROR", e.message);
  }
}

async function listPublicPrompts(req, res) {
  try {
    const page = parseInt(req.query.page || "1");
    const limit = parseInt(req.query.limit || "50");
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      Prompt.find({ visibility: "public" }).skip(skip).limit(limit),
      Prompt.countDocuments({ visibility: "public" }),
    ]);
    return respond(res, { page, limit, total, items });
  } catch (e) {
    return error(res, "SERVER_ERROR", e.message);
  }
}

async function bulkDeletePrompts(req, res) {
  try {
    const { promptIds = [] } = req.body;
    const result = await Prompt.deleteMany({ _id: { $in: promptIds } });
    return respond(res, { deleted: result.deletedCount });
  } catch (e) {
    return error(res, "SERVER_ERROR", e.message);
  }
}

async function listPublicCollections(req, res) {
  try {
    const page = parseInt(req.query.page || "1");
    const limit = parseInt(req.query.limit || "50");
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      Collection.find({ visibility: "public" }).skip(skip).limit(limit),
      Collection.countDocuments({ visibility: "public" }),
    ]);
    return respond(res, { page, limit, total, items });
  } catch (e) {
    return error(res, "SERVER_ERROR", e.message);
  }
}

async function bulkDeleteCollections(req, res) {
  try {
    const { collectionIds = [] } = req.body;
    const result = await Collection.deleteMany({ _id: { $in: collectionIds } });
    return respond(res, { deleted: result.deletedCount });
  } catch (e) {
    return error(res, "SERVER_ERROR", e.message);
  }
}

module.exports = {
  platformStats,
  listUsers,
  banUser,
  unbanUser,
  bulkUserRole,
  bulkBan,
  bulkUnban,
  listPublicPrompts,
  bulkDeletePrompts,
  listPublicCollections,
  bulkDeleteCollections,
};
