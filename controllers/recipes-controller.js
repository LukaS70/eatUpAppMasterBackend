const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');

const getRecipes = async (req, res, next) => {
    console.log('getRecipes');
    res.json({ message: 'getRecipes' })
}

const getRecipeById = async (req, res, next) => {
    console.log('getRecipeById');
    res.json({ message: 'getRecipeById' })
}

const createRecipe = async (req, res, next) => {
    console.log('createRecipe');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }
    res.json({ message: 'createRecipe' })
}

const updateRecipe = async (req, res, next) => {
    console.log('updateRecipe');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }
    res.json({ message: 'updateRecipe' })
}

const deleteRecipe = async (req, res, next) => {
    console.log('deleteRecipe');
    res.json({ message: 'deleteRecipe' })
}

exports.getRecipes = getRecipes;
exports.getRecipeById = getRecipeById;
exports.createRecipe = createRecipe;
exports.updateRecipe = updateRecipe;
exports.deleteRecipe = deleteRecipe;