const router = require('express').Router();
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { platformStats, listUsers, getUserAdmin, banUser, unbanUser, changeUserRole, bulkUserRole, bulkBan, bulkUnban, listPublicPrompts, listAllPrompts, deletePromptAdmin, bulkDeletePrompts, listPublicCollections, listAllCollections, deleteCollectionAdmin, bulkDeleteCollections } = require('../controllers/adminController');

router.use(requireAuth, requireAdmin);

router.get('/stats', platformStats);
router.get('/users', listUsers);
router.get('/users/:id', getUserAdmin);
router.patch('/users/:id/ban', banUser);
router.patch('/users/:id/unban', unbanUser);
router.patch('/users/:id/role', changeUserRole);
router.post('/users/bulk/role', bulkUserRole);
router.post('/users/bulk/ban', bulkBan);
router.post('/users/bulk/unban', bulkUnban);

// Prompts
router.get('/prompts', listPublicPrompts); // legacy public only
router.get('/prompts/all', listAllPrompts); // all visibility
router.delete('/prompts/:id', deletePromptAdmin);
router.post('/prompts/bulk/delete', bulkDeletePrompts);

// Collections
router.get('/collections', listPublicCollections); // legacy public only
router.get('/collections/all', listAllCollections);
router.delete('/collections/:id', deleteCollectionAdmin);
router.post('/collections/bulk/delete', bulkDeleteCollections);

module.exports = router;
