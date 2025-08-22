const Prompt = require("../models/Prompt");
const Engagement = require("../models/Engagement");
const respond = require("../utils/apiResponse");
const { error } = respond;

async function createPrompt(req, res) {
  try {
    const {
      title,
      description,
      content,
      category,
      tags = [],
      visibility = "public",
    } = req.body;
    if (!title || !content)
      return error(res, "VALIDATION_ERROR", "Missing title/content", 400);
    const prompt = await Prompt.create({
      title,
      description,
      content,
      category,
      tags,
      visibility,
      createdBy: req.user._id,
      versions: [{ versionNumber: 1, content, updatedBy: req.user._id }],
    });
    return respond(res, prompt, 201);
  } catch (e) {
    return error(res, "SERVER_ERROR", e.message);
  }
}

function buildQueryFilters(req) {
  const { q, category, tags, author, mine, visibility } = req.query;
  const filter = {};
  if (mine === "true" && req.user) {
    filter.createdBy = req.user._id;
    if (visibility) filter.visibility = visibility;
  } else {
    filter.visibility = "public";
    if (author) filter.createdBy = author;
  }
  if (category) filter.category = category;
  if (tags) filter.tags = { $all: tags.split(",") };
  if (q) filter.$text = { $search: q };
  return filter;
}

async function listPrompts(req, res) {
  try {
    const page = parseInt(req.query.page || "1");
    const limit = parseInt(req.query.limit || "20");
    const skip = (page - 1) * limit;
    const filter = buildQueryFilters(req);
    const sortMap = {
      recent: { createdAt: -1 },
      likes: { "stats.likes": -1 },
      remixes: { "stats.remixes": -1 },
      views: { "stats.views": -1 },
    };
    const sort = sortMap[req.query.sort] || { createdAt: -1 };
    const [items, total] = await Promise.all([
      Prompt.find(filter).sort(sort).skip(skip).limit(limit),
      Prompt.countDocuments(filter),
    ]);
    return respond(res, { page, limit, total, items });
  } catch (e) {
    return error(res, "SERVER_ERROR", e.message);
  }
}

async function getPrompt(req, res) {
  try {
    const prompt = await Prompt.findById(req.params.id);
    if (!prompt) return error(res, "NOT_FOUND", "Prompt not found", 404);
    if (
      prompt.visibility !== "public" &&
      (!req.user || prompt.createdBy.toString() !== req.user._id.toString())
    ) {
      return error(res, "FORBIDDEN", "Not allowed", 403);
    }
    return respond(res, prompt);
  } catch (e) {
    return error(res, "SERVER_ERROR", e.message);
  }
}

async function updatePrompt(req, res) {
  try {
    const prompt = await Prompt.findById(req.params.id);
    if (!prompt) return error(res, "NOT_FOUND", "Prompt not found", 404);
    if (prompt.createdBy.toString() !== req.user._id.toString())
      return error(res, "FORBIDDEN", "Not allowed", 403);
    const { title, description, content, category, tags, visibility } =
      req.body;
    if (title !== undefined) prompt.title = title;
    if (description !== undefined) prompt.description = description;
    if (category !== undefined) prompt.category = category;
    if (tags !== undefined) prompt.tags = tags;
    if (visibility !== undefined) prompt.visibility = visibility;
    if (content && content !== prompt.content) {
      const newVersionNumber =
        (prompt.versions[prompt.versions.length - 1]?.versionNumber || 0) + 1;
      prompt.content = content;
      prompt.versions.push({
        versionNumber: newVersionNumber,
        content,
        updatedBy: req.user._id,
      });
    }
    await prompt.save();
    return respond(res, prompt);
  } catch (e) {
    return error(res, "SERVER_ERROR", e.message);
  }
}

async function listVersions(req, res) {
  try {
    const prompt = await Prompt.findById(req.params.id);
    if (!prompt) return error(res, "NOT_FOUND", "Prompt not found", 404);
    if (
      prompt.visibility !== "public" &&
      prompt.createdBy.toString() !== req.user?._id?.toString()
    )
      return error(res, "FORBIDDEN", "Not allowed", 403);
    return respond(res, prompt.versions);
  } catch (e) {
    return error(res, "SERVER_ERROR", e.message);
  }
}

// Explicitly create a new version (content change only) by original creator
async function createVersion(req, res) {
  try {
    const prompt = await Prompt.findById(req.params.id);
    if (!prompt) return error(res, 'NOT_FOUND', 'Prompt not found', 404);
    if (prompt.createdBy.toString() !== req.user._id.toString()) return error(res, 'FORBIDDEN', 'Not allowed', 403);
    const { content } = req.body;
    if (!content) return error(res, 'VALIDATION_ERROR', 'Missing content', 400);
    if (content === prompt.content) return error(res, 'VALIDATION_ERROR', 'Content unchanged', 400);
    const newVersionNumber = (prompt.versions[prompt.versions.length - 1]?.versionNumber || 0) + 1;
    prompt.content = content;
    prompt.versions.push({ versionNumber: newVersionNumber, content, updatedBy: req.user._id });
    await prompt.save();
    return respond(res, { versionNumber: newVersionNumber });
  } catch (e) { return error(res, 'SERVER_ERROR', e.message); }
}

// Restore an earlier version by duplicating it as a new latest version
async function restoreVersion(req, res) {
  try {
    const { id, versionNumber } = req.params;
    const prompt = await Prompt.findById(id);
    if (!prompt) return error(res, 'NOT_FOUND', 'Prompt not found', 404);
    if (prompt.createdBy.toString() !== req.user._id.toString()) return error(res, 'FORBIDDEN', 'Not allowed', 403);
    const version = prompt.versions.find(v => v.versionNumber === parseInt(versionNumber));
    if (!version) return error(res, 'NOT_FOUND', 'Version not found', 404);
    const newVersionNumber = (prompt.versions[prompt.versions.length - 1]?.versionNumber || 0) + 1;
    prompt.content = version.content;
    prompt.versions.push({ versionNumber: newVersionNumber, content: version.content, updatedBy: req.user._id });
    await prompt.save();
    return respond(res, { restoredTo: parseInt(versionNumber), newVersionNumber });
  } catch (e) { return error(res, 'SERVER_ERROR', e.message); }
}

// Delete a specific version (cannot delete if it is the only version)
async function deleteVersion(req, res) {
  try {
    const { id, versionNumber } = req.params;
    const vn = parseInt(versionNumber);
    const prompt = await Prompt.findById(id);
    if (!prompt) return error(res, 'NOT_FOUND', 'Prompt not found', 404);
    if (prompt.createdBy.toString() !== req.user._id.toString()) return error(res, 'FORBIDDEN', 'Not allowed', 403);
    if (prompt.versions.length === 1) return error(res, 'FORBIDDEN', 'Cannot delete the only version', 403);
    const idx = prompt.versions.findIndex(v => v.versionNumber === vn);
    if (idx === -1) return error(res, 'NOT_FOUND', 'Version not found', 404);
    const latestNumber = prompt.versions[prompt.versions.length - 1].versionNumber;
    // If deleting latest version, set current content to previous version's content
    const deletingLatest = vn === latestNumber;
    prompt.versions.splice(idx, 1);
    if (deletingLatest) {
      const newLatest = prompt.versions[prompt.versions.length - 1];
      prompt.content = newLatest.content;
    }
    await prompt.save();
    return respond(res, { deleted: true, versionNumber: vn });
  } catch (e) { return error(res, 'SERVER_ERROR', e.message); }
}

async function getVersion(req, res) {
  try {
    const { id, versionNumber } = req.params;
    const prompt = await Prompt.findById(id);
    if (!prompt) return error(res, "NOT_FOUND", "Prompt not found", 404);
    if (
      prompt.visibility !== "public" &&
      prompt.createdBy.toString() !== req.user?._id?.toString()
    )
      return error(res, "FORBIDDEN", "Not allowed", 403);
    const version = prompt.versions.find(
      (v) => v.versionNumber === parseInt(versionNumber)
    );
    if (!version) return error(res, "NOT_FOUND", "Version not found", 404);
    return respond(res, version);
  } catch (e) {
    return error(res, "SERVER_ERROR", e.message);
  }
}

async function likePrompt(req, res) {
  try {
    const promptId = req.params.id;
    const exists = await Engagement.findOne({
      promptId,
      userId: req.user._id,
      type: "like",
    });
    if (!exists) {
      await Engagement.create({ promptId, userId: req.user._id, type: "like" });
      await Prompt.findByIdAndUpdate(promptId, { $inc: { "stats.likes": 1 } });
    }
    return respond(res, { liked: true });
  } catch (e) {
    return error(res, "SERVER_ERROR", e.message);
  }
}

async function unlikePrompt(req, res) {
  try {
    const promptId = req.params.id;
    const deleted = await Engagement.findOneAndDelete({
      promptId,
      userId: req.user._id,
      type: "like",
    });
    if (deleted)
      await Prompt.findByIdAndUpdate(promptId, { $inc: { "stats.likes": -1 } });
    return respond(res, { liked: false });
  } catch (e) {
    return error(res, "SERVER_ERROR", e.message);
  }
}

async function changeVisibility(req, res) {
  try {
    const prompt = await Prompt.findById(req.params.id);
    if (!prompt) return error(res, "NOT_FOUND", "Prompt not found", 404);
    if (prompt.createdBy.toString() !== req.user._id.toString())
      return error(res, "FORBIDDEN", "Not allowed", 403);
    const { visibility } = req.body;
    if (!["public", "private"].includes(visibility))
      return error(res, "VALIDATION_ERROR", "Invalid visibility", 400);
    prompt.visibility = visibility;
    await prompt.save();
    return respond(res, { id: prompt._id, visibility: prompt.visibility });
  } catch (e) {
    return error(res, "SERVER_ERROR", e.message);
  }
}

async function deletePrompt(req, res) {
  try {
    const prompt = await Prompt.findById(req.params.id);
    if (!prompt) return error(res, "NOT_FOUND", "Prompt not found", 404);
    if (prompt.createdBy.toString() !== req.user._id.toString())
      return error(res, "FORBIDDEN", "Not allowed", 403);
    await prompt.deleteOne();
    return respond(res, { deleted: true });
  } catch (e) {
    return error(res, "SERVER_ERROR", e.message);
  }
}

async function remixPrompt(req, res) {
  try {
    const original = await Prompt.findById(req.params.id);
    if (!original) return error(res, "NOT_FOUND", "Prompt not found", 404);
    if (original.visibility !== "public")
      return error(res, "FORBIDDEN", "Cannot remix private prompt", 403);
    const { title, description, content } = req.body;
    const newPrompt = await Prompt.create({
      title: title || `${original.title} (Remix)`,
      description: description || original.description,
      content: content || original.content,
      category: original.category,
      tags: original.tags,
      visibility: "public",
      createdBy: req.user._id,
      originalPromptId: original._id,
      versions: [
        {
          versionNumber: 1,
          content: content || original.content,
          updatedBy: req.user._id,
        },
      ],
    });
    await Prompt.findByIdAndUpdate(original._id, {
      $inc: { "stats.remixes": 1 },
    });
    return respond(res, newPrompt, 201);
  } catch (e) {
    return error(res, "SERVER_ERROR", e.message);
  }
}

async function listRemixes(req, res) {
  try {
    const remixes = await Prompt.find({ originalPromptId: req.params.id });
    return respond(res, remixes);
  } catch (e) {
    return error(res, "SERVER_ERROR", e.message);
  }
}

async function incrementView(req, res) {
  try {
    const promptId = req.params.id;
    await Prompt.findByIdAndUpdate(promptId, { $inc: { "stats.views": 1 } });
    return respond(res, { viewed: true });
  } catch (e) {
    return error(res, "SERVER_ERROR", e.message);
  }
}

module.exports = {
  createPrompt,
  listPrompts,
  getPrompt,
  updatePrompt,
  listVersions,
  getVersion,
  likePrompt,
  unlikePrompt,
  changeVisibility,
  deletePrompt,
  remixPrompt,
  listRemixes,
  incrementView,
  createVersion,
  restoreVersion,
  deleteVersion,
};
