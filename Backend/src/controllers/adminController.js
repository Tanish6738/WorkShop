const User = require("../models/User");
const Prompt = require("../models/Prompt");
const Collection = require("../models/Collection");
const respond = require("../utils/apiResponse");
const { error } = respond;

async function platformStats(_req, res) {
  try {
    const [users, prompts, collections, statsAgg, promptDaily, userDaily] = await Promise.all([
      User.countDocuments(),
      Prompt.countDocuments(),
      Collection.countDocuments(),
      Prompt.aggregate([
        {
          $group: {
            _id: null,
            views: { $sum: "$stats.views" },
            likes: { $sum: "$stats.likes" },
            favorites: { $sum: "$stats.favorites" },
            remixes: { $sum: "$stats.remixes" },
          },
        },
      ]),
      // Last 7 days prompt creation counts
      Prompt.aggregate([
        { $match: { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      User.aggregate([
        { $match: { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
    ]);
    const agg = statsAgg[0] || { views: 0, likes: 0, favorites: 0, remixes: 0 };
    return respond(res, {
      users,
      prompts,
      collections,
      totals: {
        views: agg.views,
        likes: agg.likes,
        favorites: agg.favorites,
        remixes: agg.remixes,
      },
      recent: {
        promptsPerDay: promptDaily.map((d) => ({ date: d._id, count: d.count })),
        usersPerDay: userDaily.map((d) => ({ date: d._id, count: d.count })),
      },
    });
  } catch (e) {
    return error(res, "SERVER_ERROR", e.message);
  }
}

async function listUsers(req, res) {
  try {
    const page = parseInt(req.query.page || "1");
    const limit = parseInt(req.query.limit || "20");
    const skip = (page - 1) * limit;
    const { q, role, banned, sort = "recent", stats } = req.query;
    const filter = {};
    if (q) filter.$or = [{ name: { $regex: q, $options: "i" } }, { email: { $regex: q, $options: "i" } }];
    if (role) filter.role = role;
    if (banned === "true") filter.banned = true;
    if (banned === "false") filter.banned = false;
    const sortMap = { recent: { createdAt: -1 }, oldest: { createdAt: 1 }, name: { name: 1 } };
    const sortSpec = sortMap[sort] || sortMap.recent;
    const [items, total] = await Promise.all([
      User.find(filter).sort(sortSpec).skip(skip).limit(limit).select("-passwordHash"),
      User.countDocuments(filter),
    ]);
    let promptCounts = {};
    let collectionCounts = {};
    if (stats === "true") {
      const [pAgg, cAgg] = await Promise.all([
        Prompt.aggregate([{ $group: { _id: "$createdBy", count: { $sum: 1 } } }]),
        Collection.aggregate([{ $group: { _id: "$createdBy", count: { $sum: 1 } } }]),
      ]);
      pAgg.forEach((r) => (promptCounts[r._id.toString()] = r.count));
      cAgg.forEach((r) => (collectionCounts[r._id.toString()] = r.count));
    }
    const enriched = items.map((u) => {
      const obj = u.toObject();
      if (stats === "true") {
        obj.promptCount = promptCounts[u._id.toString()] || 0;
        obj.collectionCount = collectionCounts[u._id.toString()] || 0;
      }
      return obj;
    });
    return respond(res, { page, limit, total, items: enriched });
  } catch (e) {
    return error(res, "SERVER_ERROR", e.message);
  }
}

async function getUserAdmin(req, res) {
  try {
    const user = await User.findById(req.params.id).select("-passwordHash");
    if (!user) return error(res, "NOT_FOUND", "User not found", 404);
    const [promptCount, collectionCount, recentPrompts, recentCollections] = await Promise.all([
      Prompt.countDocuments({ createdBy: user._id }),
      Collection.countDocuments({ createdBy: user._id }),
      Prompt.find({ createdBy: user._id }).sort({ createdAt: -1 }).limit(10),
      Collection.find({ createdBy: user._id }).sort({ createdAt: -1 }).limit(10),
    ]);
    return respond(res, {
      user,
      stats: { promptCount, collectionCount },
      recent: { prompts: recentPrompts, collections: recentCollections },
    });
  } catch (e) {
    return error(res, "SERVER_ERROR", e.message);
  }
}

async function changeUserRole(req, res) {
  try {
    const { role } = req.body;
    if (!["user", "admin"].includes(role))
      return error(res, "VALIDATION_ERROR", "Invalid role", 400);
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-passwordHash");
    if (!user) return error(res, "NOT_FOUND", "User not found", 404);
    return respond(res, { id: user._id, role: user.role });
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
  // kept for backward compat (public only)
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

async function listAllPrompts(req, res) {
  try {
    const page = parseInt(req.query.page || "1");
    const limit = parseInt(req.query.limit || "50");
    const skip = (page - 1) * limit;
    const { q, visibility, author, sort = "recent" } = req.query;
    const filter = {};
    if (visibility) filter.visibility = visibility;
    if (author) filter.createdBy = author;
    if (q) filter.$or = [
      { title: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } },
      { content: { $regex: q, $options: "i" } },
    ];
    const sortMap = {
      recent: { createdAt: -1 },
      likes: { "stats.likes": -1 },
      views: { "stats.views": -1 },
      remixes: { "stats.remixes": -1 },
    };
    const sortSpec = sortMap[sort] || sortMap.recent;
    const [items, total] = await Promise.all([
      Prompt.find(filter).sort(sortSpec).skip(skip).limit(limit),
      Prompt.countDocuments(filter),
    ]);
    return respond(res, { page, limit, total, items });
  } catch (e) {
    return error(res, "SERVER_ERROR", e.message);
  }
}

async function deletePromptAdmin(req, res) {
  try {
    const result = await Prompt.findByIdAndDelete(req.params.id);
    if (!result) return error(res, "NOT_FOUND", "Prompt not found", 404);
    return respond(res, { deleted: true });
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

async function listAllCollections(req, res) {
  try {
    const page = parseInt(req.query.page || "1");
    const limit = parseInt(req.query.limit || "50");
    const skip = (page - 1) * limit;
    const { q, visibility, author, sort = "recent" } = req.query;
    const filter = {};
    if (visibility) filter.visibility = visibility;
    if (author) filter.createdBy = author;
    if (q) filter.$or = [
      { name: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } },
    ];
    const sortMap = { recent: { createdAt: -1 }, oldest: { createdAt: 1 }, name: { name: 1 } };
    const sortSpec = sortMap[sort] || sortMap.recent;
    const [items, total] = await Promise.all([
      Collection.find(filter).sort(sortSpec).skip(skip).limit(limit),
      Collection.countDocuments(filter),
    ]);
    return respond(res, { page, limit, total, items });
  } catch (e) {
    return error(res, "SERVER_ERROR", e.message);
  }
}

async function deleteCollectionAdmin(req, res) {
  try {
    const result = await Collection.findByIdAndDelete(req.params.id);
    if (!result) return error(res, "NOT_FOUND", "Collection not found", 404);
    return respond(res, { deleted: true });
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
  getUserAdmin,
  banUser,
  unbanUser,
  changeUserRole,
  bulkUserRole,
  bulkBan,
  bulkUnban,
  listPublicPrompts,
  listAllPrompts,
  deletePromptAdmin,
  bulkDeletePrompts,
  listPublicCollections,
  listAllCollections,
  deleteCollectionAdmin,
  bulkDeleteCollections,
};
