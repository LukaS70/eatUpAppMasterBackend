const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Ingredient = require('../models/ingredient');

const getIngredients = async (req, res, next) => {
    let ingredients;
   
    try {
        ingredients = await Ingredient.find({'public': true}).populate('category').populate('measurementUnit');
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

    if (!ingredient.public) {
        const error = new HttpError('Unauthorized', 401);
        return next(error);
    }

    res.json({ ingredient: ingredient.toObject({ getters: true }) });
}

const getMyIngredients = async (req, res, next) => {
    let ingredients;
    
    try {
        ingredients = await Ingredient.find({'creator': req.userData.userId}).populate('category');
    } catch (err) {
        const error = new HttpError('Fetching ingredients failed, please try again later', 500);
        return next(error);
    }

    if (!ingredients || ingredients.length == 0) {
        const error = new HttpError('Could not find any ingredients made by you.', 404);
        return next(error);
    }

    res.status(201).json({ ingredients: ingredients.map(rec => rec.toObject({ getters: true })) });
}

const getAdminIngredients = async (req, res, next) => {
    let ingredients;

    if (!req.userData.admin) {
        const error = new HttpError('Unauthorized.', 401);
        return next(error);
    }

    try {
        ingredients = await Ingredient.find({ $or:[ {'public': true}, {'creator': req.userData.userId}, {'reviewRequested': true} ]}).populate('category').populate('ingredients.ingredient');
    } catch (err) {
        const error = new HttpError('Fetching ingredients failed, please try again later', 500);
        return next(error);
    }

    if (!ingredients || ingredients.length == 0) {
        const error = new HttpError('Could not find any ingredients.', 404);
        return next(error);
    }

    res.status(201).json({ ingredients: ingredients.map(rec => rec.toObject({ getters: true })) });
}

const uploadIngredientImage = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }

    res.status(201).json({ url: 'http://localhost:5000/' + req.file.path });
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
        public: false,                           
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
    ingredient.public = false;
    
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

const makeIngredientPublic = async (req, res, next) => {
    const ingredientId = req.params.iid;

    let ingredient;
    try {
        ingredient = await Ingredient.findById(ingredientId);
    } catch (err) {
        const error = new HttpError('Something went wrong, could not make ingredient public.', 500);
        return next(error);
    }

    if (!ingredient) {
        const error = new HttpError('Could not find a ingredient for provided id', 404);
        return next(error);
    }

    if (!req.userData.admin) {
        const error = new HttpError('You are not allowed to make this ingredient public.', 401);
        return next(error);
    }

    ingredient.public = true;
    ingredient.reviewRequested = false;

    try {
        await ingredient.save();
    } catch (err) {
        const error = new HttpError('Could not make ingredient public.', 500);
        return next(error);
    }

    res.status(200).json({ ingredient: ingredient.toObject({ getters: true }) });
} 

const unmakeIngredientPublic = async (req, res, next) => {
    const ingredientId = req.params.iid;

    let ingredient;
    try {
        ingredient = await Ingredient.findById(ingredientId);
    } catch (err) {
        const error = new HttpError('Something went wrong, could not unmake ingredient public.', 500);
        return next(error);
    }

    if (!ingredient) {
        const error = new HttpError('Could not find a ingredient for provided id', 404);
        return next(error);
    }

    if (!req.userData.admin) {
        const error = new HttpError('You are not allowed to unmake this ingredient public.', 401);
        return next(error);
    }

    ingredient.public = false;
    ingredient.reviewRequested = false;

    try {
        await ingredient.save();
    } catch (err) {
        const error = new HttpError('Could not unmake ingredient public.', 500);
        return next(error);
    }

    res.status(200).json({ ingredient: ingredient.toObject({ getters: true }) });
}

exports.uploadIngredientImage = uploadIngredientImage;
exports.getIngredients = getIngredients;
exports.getIngredientById = getIngredientById;
exports.getMyIngredients = getMyIngredients;
exports.getAdminIngredients = getAdminIngredients;
exports.createIngredient = createIngredient;
exports.updateIngredient = updateIngredient;
exports.deleteIngredient = deleteIngredient;
exports.makeIngredientPublic = makeIngredientPublic;
exports.unmakeIngredientPublic = unmakeIngredientPublic;