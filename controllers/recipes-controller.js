const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Recipe = require('../models/recipe');
const Ingredient = require('../models/ingredient');

const getRecipes = async (req, res, next) => {
    let recipes;
    
    try {
        recipes = await Recipe.find({'public': true}).populate('category');
    } catch (err) {
        const error = new HttpError('Fetching recipes failed, please try again later', 500);
        return next(error);
    }
    res.status(201).json({ recipes: recipes.map(rec => rec.toObject({ getters: true })) });
}

const getRecipeById = async (req, res, next) => {
    const recipeId = req.params.rid;

    let recipe;
    try {
        recipe = await Recipe.findById(recipeId).populate('category').populate('ingredients.ingredient');
    } catch (err) {
        const error = new HttpError('Something went wrong, could not find a recipe.', 500);
        return next(error);
    }

    if (!recipe) {
        const error = new HttpError('Could not find a recipe for the provided id.', 404);
        return next(error);
    }

    if (!recipe.public) {
        const error = new HttpError('Unauthorized', 401);
        return next(error);
    }

    res.json({ recipe: recipe.toObject({ getters: true }) });
}

const uploadRecipeImage = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }

    res.status(201).json({ url: 'http://localhost:5000/' + req.file.path });
}

const createRecipe = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }

    const { name, instructions, image, ingredients, nutrition, reviewRequested, category } = req.body;

    const createdRecipe = new Recipe({
        name: name,
        instructions: instructions,
        image: image,
        ingredients: ingredients,
        nutrition: nutrition,
        reviewRequested: reviewRequested,
        public: false,                           
        category: category,
        creator: req.userData.userId
    });

    console.log(createdRecipe);

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdRecipe.save({ session: sess });
        if (ingredients && ingredients.length > 0) {
            for (let index = 0; index < ingredients.length; index++) {
                let ing = await Ingredient.findById(ingredients[index].ingredient);
                ing.recipes.push(createdRecipe);
                await ing.save({ session: sess });
            }
        }
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError('Creating recipe failed, please try again.', 500);
        return next(error);
    }

    res.status(201).json({ recipe: createdRecipe });
}

const updateRecipe = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }

    const { name, instructions, image, ingredients, nutrition, reviewRequested, category } = req.body;
    const recipeId = req.params.rid;

    let recipe;
    try {
        recipe = await Recipe.findById(recipeId).populate('ingredients.ingredient');
    } catch (err) {
        const error = new HttpError('Something went wrong, could not update recipe.', 500);
        return next(error);
    }

    if (!recipe) {
        const error = new HttpError('Could not find a recipe for the provided id.', 404);
        return next(error);
    }

    if (recipe.creator.toString() !== req.userData.userId) {
        const error = new HttpError('You are not allowed to edit this recipe.', 401);
        return next(error);
    }

    console.log(recipe.ingredients);
    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        for (let index = 0; index < recipe.ingredients.length; index++) {
            recipe.ingredients[index].ingredient.recipes.pull(recipe);
            await recipe.ingredients[index].ingredient.save({ session: sess });
        }
        recipe.name = name;
        recipe.instructions = instructions;
        recipe.image = image;
        recipe.ingredients = ingredients;
        recipe.nutrition = nutrition;
        recipe.reviewRequested = reviewRequested;
        recipe.category = category;
        recipe.public = false;
        await recipe.save({ session: sess });
        for (let index = 0; index < recipe.ingredients.length; index++) {
            let ing = await Ingredient.findById(ingredients[index].ingredient);
            ing.recipes.push(recipe);
            await ing.save({ session: sess });
        }
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError('Could not update ingredient.', 500);
        return next(error);
    }

    res.status(200).json({ recipe: recipe.toObject({ getters: true }) });
}

const deleteRecipe = async (req, res, next) => {
    const recipeId = req.params.rid;

    let recipe;
    try {
        recipe = await Recipe.findById(recipeId).populate('ingredients.ingredient');
    } catch (err) {
        const error = new HttpError('Something went wrong, could not delete recipe.', 500);
        return next(error);
    }

    if (!recipe) {
        const error = new HttpError('Could not find a recipe for provided id', 404);
        return next(error);
    }

    if (recipe.creator.toString() !== req.userData.userId) {
        const error = new HttpError('You are not allowed to delete this recipe.', 401);
        return next(error);
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await recipe.remove({ session: sess });
        for (let index = 0; index < recipe.ingredients.length; index++) {
            recipe.ingredients[index].ingredient.recipes.pull(recipe);
            await recipe.ingredients[index].ingredient.save({ session: sess });
        }
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError('Something went wrong, could not delete recipe.', 500);
        return next(error);
    }

    res.status(200).json({ message: 'Recipe deleted.' });
}

const makeRecipePublic = async (req, res, next) => {
    const recipeId = req.params.rid;

    let recipe;
    try {
        recipe = await Recipe.findById(recipeId);
    } catch (err) {
        const error = new HttpError('Something went wrong, could not make recipe public.', 500);
        return next(error);
    }

    if (!recipe) {
        const error = new HttpError('Could not find a recipe for provided id', 404);
        return next(error);
    }

    if (!req.userData.admin) {
        const error = new HttpError('You are not allowed to make this recipe public.', 401);
        return next(error);
    }

    recipe.public = true;
    recipe.reviewRequested = false;

    try {
        await recipe.save();
    } catch (err) {
        const error = new HttpError('Could not make recipe public.', 500);
        return next(error);
    }

    res.status(200).json({ recipe: recipe.toObject({ getters: true }) });
} 

const unmakeRecipePublic = async (req, res, next) => {
    const recipeId = req.params.rid;

    let recipe;
    try {
        recipe = await Recipe.findById(recipeId);
    } catch (err) {
        const error = new HttpError('Something went wrong, could not unmake recipe public.', 500);
        return next(error);
    }

    if (!recipe) {
        const error = new HttpError('Could not find a recipe for provided id', 404);
        return next(error);
    }

    if (!req.userData.admin) {
        const error = new HttpError('You are not allowed to unmake this recipe public.', 401);
        return next(error);
    }

    recipe.public = false;
    recipe.reviewRequested = false;

    try {
        await recipe.save();
    } catch (err) {
        const error = new HttpError('Could not unmake recipe public.', 500);
        return next(error);
    }

    res.status(200).json({ recipe: recipe.toObject({ getters: true }) });
} 

exports.uploadRecipeImage = uploadRecipeImage;
exports.getRecipes = getRecipes;
exports.getRecipeById = getRecipeById;
exports.createRecipe = createRecipe;
exports.updateRecipe = updateRecipe;
exports.deleteRecipe = deleteRecipe;
exports.makeRecipePublic = makeRecipePublic;
exports.unmakeRecipePublic = unmakeRecipePublic;