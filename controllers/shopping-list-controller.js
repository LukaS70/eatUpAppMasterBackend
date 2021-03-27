const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');

const getShoppingListById = async (req, res, next) => {
    console.log('getShoppingListById');
    res.json({ message: 'getShoppingListById' })
}

const createShoppingList = async (req, res, next) => {
    console.log('createShoppingList');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }
    res.json({ message: 'createShoppingList' })
}

const updateShoppingList = async (req, res, next) => {
    console.log('updateShoppingList');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }
    res.json({ message: 'updateShoppingList' })
}


exports.getShoppingListById = getShoppingListById;
exports.createShoppingList = createShoppingList;
exports.updateShoppingList = updateShoppingList;