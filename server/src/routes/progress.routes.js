const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progress.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.get('/', progressController.getProgressEntries);
router.post('/', progressController.createProgressEntry);
router.delete('/:id', progressController.deleteProgressEntry);

module.exports = router;
