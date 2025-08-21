const router = require('express').Router();
const { register, login, me, updateMe, changePassword, refresh, logout } = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', requireAuth, me);
router.patch('/me', requireAuth, updateMe);
router.patch('/me/password', requireAuth, changePassword);

module.exports = router;
