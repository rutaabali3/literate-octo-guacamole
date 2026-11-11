const express = require('express');
const router = express.Router();
const supportController = require('../controllers/support.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.post('/tickets', supportController.createTicket);
router.get('/tickets', supportController.getTickets);

module.exports = router;
