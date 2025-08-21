const router = require('express').Router();
const { requireAuth, optionalAuth } = require('../middleware/auth');
const { createCollection, listCollections, getCollection, updateCollection, deleteCollection, addPrompt, removePrompt } = require('../controllers/collectionController');

router.post('/', requireAuth, createCollection);
router.get('/', optionalAuth, listCollections);
router.get('/:id', optionalAuth, getCollection);
router.put('/:id', requireAuth, updateCollection);
router.delete('/:id', requireAuth, deleteCollection);
router.post('/:id/prompts', requireAuth, addPrompt);
router.delete('/:id/prompts/:promptId', requireAuth, removePrompt);

module.exports = router;
