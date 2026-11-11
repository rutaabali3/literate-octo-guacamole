const express = require('express');
const router = express.Router();
const nutritionController = require('../controllers/nutrition.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.get('/', nutritionController.getNutritionLogs);
router.post('/', nutritionController.createNutritionLog);
router.put('/:id', nutritionController.updateNutritionLog);
router.delete('/:id', nutritionController.deleteNutritionLog);

module.exports = router;
