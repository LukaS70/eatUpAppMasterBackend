const express = require('express');
const { check } = require('express-validator');

const dailyNutritionController = require('../controllers/daily-nutrition-controller');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.use(checkAuth);

router.get('/:uid', dailyNutritionController.getDailyNutritionByUserId);

router.post(
    '/',
    [
        check('day').not().isEmpty(),
        check('nutrition').isObject(),
        check('nutrition.calories').isNumeric(),
        check('nutrition.totalFats').isNumeric(),
        check('nutrition.saturatedFats').isNumeric(),
        check('nutrition.totalCarbohydrates').isNumeric(),
        check('nutrition.sugar').isNumeric(),
        check('nutrition.proteine').isNumeric()
    ],
    dailyNutritionController.createDailyNutrition
);

router.patch(
    '/:dnid',
    [
        check('day').not().isEmpty(),
        check('nutrition').isObject(),
        check('nutrition.calories').isNumeric(),
        check('nutrition.totalFats').isNumeric(),
        check('nutrition.saturatedFats').isNumeric(),
        check('nutrition.totalCarbohydrates').isNumeric(),
        check('nutrition.sugar').isNumeric(),
        check('nutrition.proteine').isNumeric()
    ],
    dailyNutritionController.updateDailyNutrition
);

module.exports = router;