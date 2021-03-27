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
        check('nutrition.calories').isNumeric(),
        check('nutrition.totalFats').isNumeric(),
        check('nutrition.saturatedFats').isNumeric(),
        check('nutrition.totalCarbohydrates').isNumeric(),
        check('nutrition.sugar').isNumeric(),
        check('nutrition.proteine').isNumeric(),
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
        check('nutrition.calories').isNumeric(),
        check('nutrition.totalFats').isNumeric(),
        check('nutrition.saturatedFats').isNumeric(),
        check('nutrition.totalCarbohydrates').isNumeric(),
        check('nutrition.sugar').isNumeric(),
        check('nutrition.proteine').isNumeric(),
        check('reviewRequested').isBoolean(),
        check('measurementUnit').not().isEmpty(),
        check('category').not().isEmpty()
    ],
    ingredientsController.updateIngredient
);

router.delete('/:iid', ingredientsController.deleteIngredient);

module.exports = router;