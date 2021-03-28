const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const ShoppingList = require('../models/shopping-list');

const getShoppingListById = async (req, res, next) => {
    const shoppingListId = req.params.slid;

    let shoppingList;
    try {
        shoppingList = await ShoppingList.findById(shoppingListId).populate('items.ingredient');
    } catch (err) {
        const error = new HttpError('Something went wrong, could not fetch shopping list.', 500);
        return next(error);
    }

    if (!shoppingList) {
        const error = new HttpError('Could not find a shopping list for the provided id.', 404);
        return next(error);
    }

    if (shoppingList.creator.toString() !== req.userData.userId) {
        const error = new HttpError('Unauthorized', 401);
        return next(error);
    }

    res.status(200).json({ shoppingList: shoppingList.toObject({ getters: true }) });
}

const updateShoppingList = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }

    const { items } = req.body;
    const shoppingListId = req.params.slid;

    let shoppingList;
    try {
        shoppingList = await ShoppingList.findById(shoppingListId).populate('items.ingredient');
    } catch (err) {
        const error = new HttpError('Something went wrong, could not update shopping list.', 500);
        return next(error);
    }

    if (!shoppingList) {
        const error = new HttpError('Could not find a shopping list for the provided id.', 404);
        return next(error);
    }

    if (shoppingList.creator.toString() !== req.userData.userId) {
        const error = new HttpError('You are not allowed to edit this shopping list.', 401);
        return next(error);
    }

    shoppingList.items = items;

    try {
        await shoppingList.save();
    } catch (err) {
        const error = new HttpError('Could not update shopping list.', 500);
        return next(error);
    }

    res.status(200).json({ shoppingList: shoppingList.toObject({ getters: true }) });
}


exports.getShoppingListById = getShoppingListById;
exports.updateShoppingList = updateShoppingList;