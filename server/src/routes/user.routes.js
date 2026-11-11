const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.get('/me', userController.getMe);
router.put('/me', userController.updateMe);
router.patch('/me/preferences', userController.updatePreferences);
router.delete('/me', userController.deleteAccount);
router.post('/:id/follow', userController.toggleFollow);

module.exports = router;
