const express = require('express');
const { check } = require('express-validator');

const shoppingListController = require('../controllers/shopping-list-controller');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.use(checkAuth);

router.get('/:slid', shoppingListController.getShoppingListById);

router.post(
    '/',
    [
        check('ingredients').isArray({ min: 1 }),
        check('ingredients.*.amount').isFloat({ min: 0 }),
        check('ingredients.*.checked').isBoolean(),
        check('ingredients.*.ingredient').not().isEmpty(),
    ],
    shoppingListController.createShoppingList
);

router.patch(
    '/:slid',
    [
        check('ingredients').isArray({ min: 1 }),
        check('ingredients.*.amount').isFloat({ min: 0 }),
        check('ingredients.*.checked').isBoolean(),
        check('ingredients.*.ingredient').not().isEmpty(),
    ],
    shoppingListController.updateShoppingList
);

module.exports = router;