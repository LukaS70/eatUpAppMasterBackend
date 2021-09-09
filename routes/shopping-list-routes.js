const express = require('express');
const { check } = require('express-validator');

const shoppingListController = require('../controllers/shopping-list-controller');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.use(checkAuth);

router.get('/', shoppingListController.getShoppingLists);

router.get('/:slid', shoppingListController.getShoppingListById);

router.patch(
    '/:slid',
    [
        check('items').isArray(),
        check('items.*.amount').isFloat({ min: 0 }),
        check('items.*.checked').isBoolean(),
        check('items.*.ingredient').not().isEmpty(),
    ],
    shoppingListController.updateShoppingList
);

module.exports = router;