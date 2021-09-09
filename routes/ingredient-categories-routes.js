const express = require('express');
const { check } = require('express-validator');

const ingredientCategoriesController = require('../controllers/ingredient-categories-controller');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();


router.get('/', ingredientCategoriesController.getIngredientCategories);

router.use(checkAuth);

router.post(
    '/',
    [
        check('name').not().isEmpty(),
        check('displayName').not().isEmpty()
    ],
    ingredientCategoriesController.createIngredientCategory
);

router.patch(
    '/:icid',
    [
        check('name').not().isEmpty(),
        check('displayName').not().isEmpty()
    ],
    ingredientCategoriesController.updateIngredientCategory
);

router.delete('/:icid', ingredientCategoriesController.deleteIngredientCategory);

module.exports = router;