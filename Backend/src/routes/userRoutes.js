const router = require('express').Router();
const { getUserProfile, userPrompts, userCollections } = require('../controllers/userController');

router.get('/:id', getUserProfile);
router.get('/:id/prompts', userPrompts);
router.get('/:id/collections', userCollections);

module.exports = router;
