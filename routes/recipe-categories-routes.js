const express = require('express');
const { check } = require('express-validator');

const recipeCategoriesController = require('../controllers/recipe-categories-controller');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();


router.get('/', recipeCategoriesController.getRecipeCategories);

router.use(checkAuth);

router.post(
    '/',
    [
        check('name').not().isEmpty(),
        check('displayName').not().isEmpty()
    ],
    recipeCategoriesController.createRecipeCategory
);

router.patch(
    '/:rcid',
    [
        check('name').not().isEmpty(),
        check('displayName').not().isEmpty()
    ],
    recipeCategoriesController.updateRecipeCategory
);

router.delete('/:rcid', recipeCategoriesController.deleteRecipeCategory);

module.exports = router;