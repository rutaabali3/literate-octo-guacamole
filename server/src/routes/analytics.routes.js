const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.get('/overview', analyticsController.getOverviewAnalytics);
router.get('/workouts', analyticsController.getWorkoutsAnalytics);
router.get('/nutrition', analyticsController.getNutritionAnalytics);
router.get('/summary', analyticsController.getDashboardSummary);

module.exports = router;
