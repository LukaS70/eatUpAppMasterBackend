const HttpError = require('../models/http-error');

const getIngredientCategories = async (req, res, next) => {
    console.log('getIngredientCategories');
    res.json({ message: 'getIngredientCategories' })
}

exports.getIngredientCategories = getIngredientCategories;