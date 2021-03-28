const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Ingredient = require('../models/ingredient');

const getIngredients = async (req, res, next) => {
    let ingredients;
    // later filter non public ings
    try {
        ingredients = await Ingredient.find().populate('category').populate('measurementUnit');
    } catch (err) {
        const error = new HttpError('Fetching ingredients failed, please try again later', 500);
        return next(error);
    }
    res.status(201).json({ ingredients: ingredients.map(ing => ing.toObject({ getters: true })) });
}

const getIngredientById = async (req, res, next) => {
    const ingredientId = req.params.iid;

    let ingredient;
    try {
        ingredient = await Ingredient.findById(ingredientId).populate('category').populate('measurementUnit');
    } catch (err) {
        const error = new HttpError('Something went wrong, could not find an ingredient.', 500);
        return next(error);
    }

    if (!ingredient) {
        const error = new HttpError('Could not find an ingredient for the provided id.', 404);
        return next(error);
    }

    /* if (!ingredient.public && ingredient.creator.toString() !== req.userData.userId) {       // adding for public 
        const error = new HttpError('Unauthorized', 401);
        return next(error);
    } */

    res.json({ ingredient: ingredient.toObject({ getters: true }) });
}

const createIngredient = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }

    const { name, image, nutrition, reviewRequested, measurementUnit, category } = req.body;

    const createdIngredient = new Ingredient({
        name: name,
        image: image,
        nutrition: nutrition,
        reviewRequested: reviewRequested,
        public: true,                           // promeniti na false kad se doda admin
        measurementUnit: measurementUnit,
        category: category,
        recipes: [],
        creator: req.userData.userId
    });

    console.log(createdIngredient);

    try {
        await createdIngredient.save();
    } catch (err) {
        const error = new HttpError('Creating ingredient failed, please try again.', 500);
        return next(error);
    }

    res.status(201).json({ ingredient: createdIngredient });
}

const updateIngredient = async (req, res, next) => {        // zabrani update nutritiva
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }

    const { name, image, nutrition, reviewRequested, measurementUnit, category } = req.body;
    const ingredientId = req.params.iid;

    let ingredient;
    try {
        ingredient = await Ingredient.findById(ingredientId);
    } catch (err) {
        const error = new HttpError('Something went wrong, could not update ingredient.', 500);
        return next(error);
    }

    if (!ingredient) {
        const error = new HttpError('Could not find an ingredient for the provided id.', 404);
        return next(error);
    }

    if (ingredient.creator.toString() !== req.userData.userId) {
        const error = new HttpError('You are not allowed to edit this ingredient.', 401);
        return next(error);
    }

    ingredient.name = name;
    ingredient.image = image;
    ingredient.nutrition = nutrition;
    ingredient.reviewRequested = reviewRequested;
    ingredient.measurementUnit = measurementUnit;
    ingredient.category = category;

    try {
        await ingredient.save();
    } catch (err) {
        const error = new HttpError('Could not update ingredient.', 500);
        return next(error);
    }

    res.status(200).json({ ingredient: ingredient.toObject({ getters: true }) });
}

const deleteIngredient = async (req, res, next) => {                                    /////////// ??????????//
    const ingredientId = req.params.iid;

    let ingredient;
    try {
        ingredient = await Ingredient.findById(ingredientId).populate('recipes');
    } catch (err) {
        console.log('asd');
        const error = new HttpError('Something went wrong, could not delete ingredient.', 500);
        return next(error);
    }

    if (!ingredient) {
        const error = new HttpError('Could not find ingredient for provided id', 404);
        return next(error);
    }

    if (ingredient.creator.toString() !== req.userData.userId) {
        const error = new HttpError('You are not allowed to delete this ingredient.', 401);
        return next(error);
    }

    if (ingredient.recipes.length !== 0) {
        const error = new HttpError(`Ingredient cant be deleted beacause its in use by ${ingredient.recipes.length} recipes`, 401);
        return next(error);
    }

    try {
        await ingredient.remove();
        //   mozda implementirati
        /* const sess = await mongoose.startSession();
        sess.startTransaction();
        await ingredient.remove({ session: sess });
        if (ingredient.recipes && ingredient.recipes.length > 0) {                      // proveriti da li brisanje radi kako treba
            for (let index = 0; index < ingredient.recipes.length; index++) {       // da iz svakog recepta koji sadrzi ovaj sastojak, isti uklonimo 
                console.log(ingredient.recipes[index]);
                ingredient.recipes[index].ingredients.pull({ amount: 21 });         //NE MOZE ingredient u ZAGRADI. smisliti nesto // dodati umanjivanje nutritivne
                await ingredient.recipes[index].save({ session: sess });
            }
        }
        await sess.commitTransaction(); */
    } catch (err) {
        const error = new HttpError('Something went wrong, could not delete ingredient.', 500);
        return next(error);
    }

    res.status(200).json({ message: 'Ingredient deleted.' });
}

exports.getIngredients = getIngredients;
exports.getIngredientById = getIngredientById;
exports.createIngredient = createIngredient;
exports.updateIngredient = updateIngredient;
exports.deleteIngredient = deleteIngredient;