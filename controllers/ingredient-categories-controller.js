const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const IngredientCategory = require('../models/ingredient-category');

const getIngredientCategories = async (req, res, next) => {
    let categories;
    try {
        categories = await IngredientCategory.find();
    } catch (err) {
        const error = new HttpError('Fetching ingredient categories faild, please try again later', 500);
        return next(error);
    }
    res.status(201).json({ ingredientCategories: categories.map(category => category.toObject({ getters: true })) });
}

const createIngredientCategory = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }

    const { name, displayName } = req.body;

    const createdIngredientCategory = new IngredientCategory({
        name: name,
        displayName: displayName
    });

    if (!req.userData.admin) {
        const error = new HttpError('You are not allowed to add ingredient categories.', 401);
        return next(error);
    }

    try {
        await createdIngredientCategory.save();
    } catch (err) {
        const error = new HttpError('Creating ingredient category failed, please try again.', 500);
        return next(error);
    }

    res.status(201).json({ ingredientCategory: createdIngredientCategory });
}

const updateIngredientCategory = async (req, res, next) => {        
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }

    const { name, displayName } = req.body;
    const ingredientCategoryId = req.params.icid;

    let ingredientCategory;
    try {
        ingredientCategory = await IngredientCategory.findById(ingredientCategoryId);
    } catch (err) {
        const error = new HttpError('Something went wrong, could not update ingredient category.', 500);
        return next(error);
    }

    if (!ingredientCategory) {
        const error = new HttpError('Could not find an ingredient category for the provided id.', 404);
        return next(error);
    }

    if (!req.userData.admin) {
        const error = new HttpError('You are not allowed to edit this ingredient category.', 401);
        return next(error);
    }

    ingredientCategory.name = name;
    ingredientCategory.displayName = displayName;
    
    try {
        await ingredientCategory.save();
    } catch (err) {
        const error = new HttpError('Could not update ingredient category.', 500);
        return next(error);
    }

    res.status(200).json({ ingredientCategory: ingredientCategory.toObject({ getters: true }) });
}

const deleteIngredientCategory = async (req, res, next) => {                                 
    const ingredientCategoryId = req.params.icid;

    let ingredientCategory;
    try {
        ingredientCategory = await IngredientCategory.findById(ingredientCategoryId);
    } catch (err) {
        const error = new HttpError('Something went wrong, could not delete ingredient category.', 500);
        return next(error);
    }

    if (!ingredientCategory) {
        const error = new HttpError('Could not find ingredient category for provided id', 404);
        return next(error);
    }

    if (!req.userData.admin) {
        const error = new HttpError('You are not allowed to delete this ingredient category.', 401);
        return next(error);
    }

    try {
        await ingredientCategory.remove();
    } catch (err) {
        const error = new HttpError('Something went wrong, could not delete ingredient category.', 500);
        return next(error);
    }

    res.status(200).json({ message: 'Ingredient category deleted.' });
}

exports.getIngredientCategories = getIngredientCategories;
exports.createIngredientCategory = createIngredientCategory;
exports.updateIngredientCategory = updateIngredientCategory;
exports.deleteIngredientCategory = deleteIngredientCategory;