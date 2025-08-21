const router = require('express').Router();
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { platformStats, listUsers, banUser, unbanUser, bulkUserRole, bulkBan, bulkUnban, listPublicPrompts, bulkDeletePrompts, listPublicCollections, bulkDeleteCollections } = require('../controllers/adminController');

router.use(requireAuth, requireAdmin);

router.get('/stats', platformStats);
router.get('/users', listUsers);
router.patch('/users/:id/ban', banUser);
router.patch('/users/:id/unban', unbanUser);
router.post('/users/bulk/role', bulkUserRole);
router.post('/users/bulk/ban', bulkBan);
router.post('/users/bulk/unban', bulkUnban);

router.get('/prompts', listPublicPrompts);
router.post('/prompts/bulk/delete', bulkDeletePrompts);

router.get('/collections', listPublicCollections);
router.post('/collections/bulk/delete', bulkDeleteCollections);

module.exports = router;
