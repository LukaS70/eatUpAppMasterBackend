const express = require('express');
const { check } = require('express-validator');

const ingredientsController = require('../controllers/ingredients-controller');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();


router.get('/', ingredientsController.getIngredients);

router.get('/:iid', ingredientsController.getIngredientById);

router.use(checkAuth);

router.post(
    '/',
    [
        check('name').not().isEmpty(),
        check('image').not().isEmpty(),
        check('nutrition').isObject(),
        check('nutrition.calories').isFloat({ min: 0 }),
        check('nutrition.totalFats').isFloat({ min: 0 }),
        check('nutrition.saturatedFats').isFloat({ min: 0 }),
        check('nutrition.totalCarbohydrates').isFloat({ min: 0 }),
        check('nutrition.sugar').isFloat({ min: 0 }),
        check('nutrition.proteine').isFloat({ min: 0 }),
        check('reviewRequested').isBoolean(),
        check('measurementUnit').not().isEmpty(),
        check('category').not().isEmpty()
    ],
    ingredientsController.createIngredient
);

router.patch(
    '/:iid',
    [
        check('name').not().isEmpty(),
        check('image').not().isEmpty(),
        check('nutrition').isObject(),
        check('nutrition.calories').isFloat({ min: 0 }),
        check('nutrition.totalFats').isFloat({ min: 0 }),
        check('nutrition.saturatedFats').isFloat({ min: 0 }),
        check('nutrition.totalCarbohydrates').isFloat({ min: 0 }),
        check('nutrition.sugar').isFloat({ min: 0 }),
        check('nutrition.proteine').isFloat({ min: 0 }),
        check('reviewRequested').isBoolean(),
        check('measurementUnit').not().isEmpty(),
        check('category').not().isEmpty()
    ],
    ingredientsController.updateIngredient
);

router.delete('/:iid', ingredientsController.deleteIngredient);

module.exports = router;