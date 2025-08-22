const router = require('express').Router();
const { requireAuth, optionalAuth } = require('../middleware/auth');
const { favoritePrompt, unfavoritePrompt, getEngagement, likePrompt, unlikePrompt, listFavorites, listLikes } = require('../controllers/engagementController');

router.post('/prompts/:id/favorite', requireAuth, favoritePrompt);
router.delete('/prompts/:id/favorite', requireAuth, unfavoritePrompt);
router.post('/prompts/:id/like', requireAuth, likePrompt);
router.delete('/prompts/:id/like', requireAuth, unlikePrompt);
router.get('/prompts/:id/engagement', optionalAuth, getEngagement);
router.get('/me/favorites', requireAuth, listFavorites);
router.get('/me/likes', requireAuth, listLikes);

module.exports = router;
