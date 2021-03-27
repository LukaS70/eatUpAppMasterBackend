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
        check('nutrition.calories').isFloat({ min: 0 }),
        check('nutrition.totalFats').isFloat({ min: 0 }),
        check('nutrition.saturatedFats').isFloat({ min: 0 }),
        check('nutrition.totalCarbohydrates').isFloat({ min: 0 }),
        check('nutrition.sugar').isFloat({ min: 0 }),
        check('nutrition.proteine').isFloat({ min: 0 })
    ],
    dailyNutritionController.createDailyNutrition
);

router.patch(
    '/:dnid',
    [
        check('day').not().isEmpty(),
        check('nutrition').isObject(),
        check('nutrition.calories').isFloat({ min: 0 }),
        check('nutrition.totalFats').isFloat({ min: 0 }),
        check('nutrition.saturatedFats').isFloat({ min: 0 }),
        check('nutrition.totalCarbohydrates').isFloat({ min: 0 }),
        check('nutrition.sugar').isFloat({ min: 0 }),
        check('nutrition.proteine').isFloat({ min: 0 })
    ],
    dailyNutritionController.updateDailyNutrition
);

module.exports = router;