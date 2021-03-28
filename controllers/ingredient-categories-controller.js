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

exports.getIngredientCategories = getIngredientCategories;