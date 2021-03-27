const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');

const getIngredients = async (req, res, next) => {
    console.log('getIngredients');
    res.json({ message: 'getIngredients' })
}

const getIngredientById = async (req, res, next) => {
    console.log('getIngredientById');
    res.json({ message: 'getIngredientById' })
}

const createIngredient = async (req, res, next) => {
    console.log('createIngredient');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }
    res.json({ message: 'createIngredient' })
}

const updateIngredient = async (req, res, next) => {
    console.log('updateIngredient');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }
    res.json({ message: 'updateIngredient' })
}

const deleteIngredient = async (req, res, next) => {
    console.log('deleteRecipe');
    res.json({ message: 'deleteIngredient' })
}

exports.getIngredients = getIngredients;
exports.getIngredientById = getIngredientById;
exports.createIngredient = createIngredient;
exports.updateIngredient = updateIngredient;
exports.deleteIngredient = deleteIngredient;