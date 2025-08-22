const router = require('express').Router();
const { requireAuth, optionalAuth } = require('../middleware/auth');
const { createPrompt, listPrompts, getPrompt, updatePrompt, listVersions, getVersion, likePrompt, unlikePrompt, changeVisibility, deletePrompt, remixPrompt, listRemixes, incrementView, createVersion, restoreVersion, deleteVersion } = require('../controllers/promptController');

router.post('/', requireAuth, createPrompt);
router.get('/', optionalAuth, listPrompts);
router.get('/:id', optionalAuth, getPrompt);
router.put('/:id', requireAuth, updatePrompt);
router.patch('/:id/visibility', requireAuth, changeVisibility);
router.delete('/:id', requireAuth, deletePrompt);
router.get('/:id/versions', optionalAuth, listVersions);
router.get('/:id/versions/:versionNumber', optionalAuth, getVersion);
router.post('/:id/versions', requireAuth, createVersion); // body: { content }
router.post('/:id/versions/:versionNumber/restore', requireAuth, restoreVersion);
router.delete('/:id/versions/:versionNumber', requireAuth, deleteVersion);
router.post('/:id/remix', requireAuth, remixPrompt);
router.get('/:id/remixes', optionalAuth, listRemixes);
router.post('/:id/view', optionalAuth, incrementView);
router.post('/:id/like', requireAuth, likePrompt);
router.delete('/:id/like', requireAuth, unlikePrompt);

module.exports = router;
