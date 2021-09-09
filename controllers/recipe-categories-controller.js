const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const RecipeCategory = require('../models/recipe-category');

const getRecipeCategories = async (req, res, next) => {
    let categories;
    try {
        categories = await RecipeCategory.find();
    } catch (err) {
        const error = new HttpError('Fetching recipe categories faild, please try again later', 500);
        return next(error);
    }
    res.status(201).json({ recipeCategories: categories.map(category => category.toObject({ getters: true })) });
}

const createRecipeCategory = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }

    const { name, displayName } = req.body;

    const createdRecipeCategory = new RecipeCategory({
        name: name,
        displayName: displayName
    });

    if (!req.userData.admin) {
        const error = new HttpError('You are not allowed to add recipe categories.', 401);
        return next(error);
    }

    try {
        await createdRecipeCategory.save();
    } catch (err) {
        const error = new HttpError('Creating recipe category failed, please try again.', 500);
        return next(error);
    }

    res.status(201).json({ recipeCategory: createdRecipeCategory });
}

const updateRecipeCategory = async (req, res, next) => {        
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }

    const { name, displayName } = req.body;
    const recipeCategoryId = req.params.rcid;

    let recipeCategory;
    try {
        recipeCategory = await RecipeCategory.findById(recipeCategoryId);
    } catch (err) {
        const error = new HttpError('Something went wrong, could not update recipe category.', 500);
        return next(error);
    }

    if (!recipeCategory) {
        const error = new HttpError('Could not find an recipe category for the provided id.', 404);
        return next(error);
    }

    if (!req.userData.admin) {
        const error = new HttpError('You are not allowed to edit this recipe category.', 401);
        return next(error);
    }

    recipeCategory.name = name;
    recipeCategory.displayName = displayName;
    
    try {
        await recipeCategory.save();
    } catch (err) {
        const error = new HttpError('Could not update recipe category.', 500);
        return next(error);
    }

    res.status(200).json({ recipeCategory: recipeCategory.toObject({ getters: true }) });
}

const deleteRecipeCategory = async (req, res, next) => {                                 
    const recipeCategoryId = req.params.rcid;

    let recipeCategory;
    try {
        recipeCategory = await RecipeCategory.findById(recipeCategoryId);
    } catch (err) {
        const error = new HttpError('Something went wrong, could not delete recipe category.', 500);
        return next(error);
    }

    if (!recipeCategory) {
        const error = new HttpError('Could not find recipe category for provided id', 404);
        return next(error);
    }

    if (!req.userData.admin) {
        const error = new HttpError('You are not allowed to delete this recipe category.', 401);
        return next(error);
    }

    try {
        await recipeCategory.remove();
    } catch (err) {
        const error = new HttpError('Something went wrong, could not delete recipe category.', 500);
        return next(error);
    }

    res.status(200).json({ message: 'Recipe category deleted.' });
}

exports.getRecipeCategories = getRecipeCategories;
exports.createRecipeCategory = createRecipeCategory;
exports.updateRecipeCategory = updateRecipeCategory;
exports.deleteRecipeCategory = deleteRecipeCategory;